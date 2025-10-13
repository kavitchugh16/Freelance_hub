import React, { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

interface MilestoneInput {
  title: string;
  description: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (milestoneInputs: MilestoneInput[]) => void;
  totalAmount: number;
}

const MilestoneDefinitionModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, totalAmount }) => {
  const [milestones, setMilestones] = useState<MilestoneInput[]>([{ title: '', description: '' }]);

  const handleAddMilestone = () => {
    setMilestones([...milestones, { title: '', description: '' }]);
  };

  const handleRemoveMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleMilestoneChange = (index: number, field: 'title' | 'description', value: string) => {
    const newMilestones = [...milestones];
    newMilestones[index][field] = value;
    setMilestones(newMilestones);
  };

  const handleSubmit = () => {
    // Validate that all milestones have a title
    if (milestones.some(m => !m.title.trim())) {
      alert("Please provide a title for all milestones.");
      return;
    }
    onSubmit(milestones);
  };

  if (!isOpen) return null;

  const milestoneCount = milestones.length;
  const amountPerMilestone = milestoneCount > 0 ? (totalAmount / milestoneCount).toFixed(2) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Define Project Milestones</h2>
        <p className="mb-4 text-gray-600">
          The total project amount of <strong>₹{totalAmount.toFixed(2)}</strong> will be split evenly among these milestones. 
          Each of the <strong>{milestoneCount}</strong> milestones will be worth approximately <strong>₹{amountPerMilestone}</strong>.
        </p>

        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
          {milestones.map((milestone, index) => (
            <div key={index} className="p-3 border rounded-md bg-gray-50 relative">
              <h4 className="font-semibold mb-2">Milestone {index + 1}</h4>
              <input
                type="text"
                placeholder="Milestone Title (e.g., 'Phase 1: Design Mockups')"
                value={milestone.title}
                onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                className="border w-full p-2 rounded-md mb-2"
              />
              <textarea
                placeholder="Description (e.g., 'Deliver high-fidelity mockups for all main pages')"
                value={milestone.description}
                onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                rows={2}
                className="border w-full p-2 rounded-md"
              />
              {milestones.length > 1 && (
                <button
                  onClick={() => handleRemoveMilestone(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleAddMilestone}
          className="mt-4 text-sm text-blue-600 font-semibold flex items-center"
        >
          <FaPlus className="mr-2" /> Add Another Milestone
        </button>

        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400">
            Cancel
          </button>
          <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Confirm & Start Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default MilestoneDefinitionModal;