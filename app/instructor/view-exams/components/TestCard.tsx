import { SATTest } from '@/types/sat';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface TestCardProps {
  test: SATTest;
  onPreview: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TestCard({ test, onPreview, onEdit, onDelete }: TestCardProps) {
  const sectionTypes = test.sections.map(section => section.type);
  const formattedSections = sectionTypes
    .map(type => type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' '))
    .join(', ');

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">{test.name}</h2>
          <p className="text-gray-600">
            Created {format(new Date(test.created_at), 'yyyy-MM-dd')}
            {test.published && (
              <span className="ml-2 text-green-600">• Published</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onPreview(test.id)}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Preview"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={() => onEdit(test.id)}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Edit"
          >
            <Pencil className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(test.id)}
            className="p-2 hover:bg-gray-100 rounded-full text-red-500"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-700">Sections</h3>
          <p className="text-gray-600">{formattedSections}</p>
        </div>

        <div>
          <h3 className="font-medium text-gray-700">Students Taken</h3>
          <p className="text-gray-600">{test.student_count} students</p>
        </div>

        <div>
          <h3 className="font-medium text-gray-700">Average Score</h3>
          <p className="text-gray-600">{test.average_score}</p>
        </div>

        <button
          onClick={() => onPreview(test.id)}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
          View Analytics
        </button>
      </div>
    </div>
  );
} 