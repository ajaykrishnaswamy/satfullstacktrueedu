import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create a Supabase client with the service role key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getTableColumns(tableName: string) {
  try {
    // Query the information_schema to get column information
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', tableName)
      .order('ordinal_position');

    if (error) {
      console.error(`Error fetching columns for table ${tableName}:`, error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Error fetching columns for table ${tableName}:`, error);
    return null;
  }
}

async function getAllTables() {
  try {
    // Query the information_schema to get all tables
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');

    if (error) {
      console.error('Error fetching tables:', error);
      return [];
    }

    return data.map(table => table.table_name);
  } catch (error) {
    console.error('Error fetching tables:', error);
    return [];
  }
}

function generateTypeScriptType(tableName: string, columns: any[]) {
  const interfaceName = tableName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  let typeDefinition = `export interface ${interfaceName} {\n`;

  columns.forEach(column => {
    const columnName = column.column_name;
    let type = 'any';

    // Map PostgreSQL types to TypeScript types
    switch (column.data_type) {
      case 'integer':
      case 'bigint':
      case 'smallint':
        type = 'number';
        break;
      case 'numeric':
      case 'real':
      case 'double precision':
        type = 'number';
        break;
      case 'boolean':
        type = 'boolean';
        break;
      case 'character varying':
      case 'text':
      case 'uuid':
      case 'timestamp with time zone':
      case 'timestamp without time zone':
      case 'date':
        type = 'string';
        break;
      case 'jsonb':
      case 'json':
        type = 'any';
        break;
      default:
        type = 'any';
    }

    // Handle nullable fields
    const isNullable = column.is_nullable === 'YES';
    const typeWithNullability = isNullable ? `${type} | null` : type;

    typeDefinition += `  ${columnName}: ${typeWithNullability};\n`;
  });

  typeDefinition += '}\n\n';
  return typeDefinition;
}

async function generateTypes() {
  try {
    const tables = await getAllTables();
    console.log(`Found ${tables.length} tables in the database.`);

    let allTypes = '// This file is auto-generated. Do not edit manually.\n\n';

    for (const table of tables) {
      console.log(`Processing table: ${table}`);
      const columns = await getTableColumns(table);
      
      if (columns) {
        allTypes += generateTypeScriptType(table, columns);
      }
    }

    // Write to a file
    const typesDir = path.join(process.cwd(), 'types');
    if (!fs.existsSync(typesDir)) {
      fs.mkdirSync(typesDir, { recursive: true });
    }

    fs.writeFileSync(path.join(typesDir, 'supabase-schema.ts'), allTypes);
    console.log('Types generated successfully in types/supabase-schema.ts');
  } catch (error) {
    console.error('Error generating types:', error);
  }
}

// Run the script
generateTypes(); 