import React from "react";

interface NewFeatureCardProps {
    title: string;
    description: string;
    linkText: string;
    beta?: boolean;
    iconContent: React.ReactNode;
    studentsCount?: number;
    progress?: { completed: number; total: number; };
}

const NewFeatureCard: React.FC<NewFeatureCardProps> = ({
    title,
    description,
    linkText,
    beta,
    iconContent,
    studentsCount,
    progress
}) => {
    return (
        // REMOVED: h-80 w-72 to allow for flexible sizing within the grid
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition cursor-pointer flex flex-col justify-between">
            {/* Top Section with Image/Icon and Beta Tag */}
            <div className="flex justify-between items-start mb-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-2">
                    {iconContent}
                </div>
                {beta && (
                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                        Beta
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="flex-grow">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{title}</h4>
                {studentsCount !== undefined && (
                    <p className="text-sm text-gray-600 mb-2">{studentsCount} students</p>
                )}
                <p className="text-gray-700 text-sm mb-4">{description}</p>
            </div>

            {/* Link at the bottom */}
            <a href="#" className="text-blue-600 font-medium text-sm flex items-center group">
                {linkText}
                <svg
                    className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                    ></path>
                </svg>
            </a>
        </div>
    );
};

export default NewFeatureCard;