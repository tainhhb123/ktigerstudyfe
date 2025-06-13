import React, { JSX } from "react";
import { Link, useLocation } from "react-router-dom";
import PageMeta from "../../../components/document/common/PageMeta";
import NewFeatureCard from "../../../components/document/class/NewFeatureCard"; // Ensure this path is correct

const tabs = [
    { label: "Tài liệu", path: "/documents/Library/tai-lieu" },
    { label: "Tài liệu yêu thích", path: "/documents/Library/tailieuyeuthich" },
    { label: "Lớp học của tôi", path: "/documents/Library/lop-hoc" },
    { label: "Lớp học tham gia", path: "/documents/Library/lophocthamgia" },
];

export default function ParticipateClass(): JSX.Element {
    const location = useLocation();
    // Adjusted iconBaseClasses for consistent sizing within the rounded background
    const iconBaseClasses = "w-12 h-12 text-gray-700"; // Slightly larger to fill the 16x16 container better

    const newFeatures = [
        {
            title: "Images have arrived",
            description: "Add images to terms from Unsplash or upload your own.",
            linkText: "Try it out",
            iconContent: (
                <svg className={iconBaseClasses} fill="none" viewBox="0 0 48 48" stroke="currentColor">
                    {/* Paths for the "Images have arrived" icon, adjusted for a 48x48 viewBox */}
                    <path fill="#C4B5FD" d="M37 20C37 22.2091 35.2091 24 33 24C30.7909 24 29 22.2091 29 20C29 17.7909 30.7909 16 33 16C35.2091 16 37 17.7909 37 20Z" />
                    <path fill="#818CF8" d="M25 12C25 14.2091 23.2091 16 21 16C18.7909 16 17 14.2091 17 12C17 9.79086 18.7909 8 21 8C23.2091 8 25 9.79086 25 12Z" />
                    <path fill="#A78BFA" d="M21 28C21 30.2091 19.2091 32 17 32C14.7909 32 13 30.2091 13 28C13 25.7909 14.7909 24 17 24C19.2091 24 21 25.7909 21 28Z" />
                    <path fill="#818CF8" d="M33 28C33 30.2091 31.2091 32 29 32C26.7909 32 25 30.2091 25 28C25 25.7909 26.7909 24 29 24C31.2091 24 33 25.7909 33 28Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 36L6 12L42 12V36H6Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M35 36V42" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M32 39H38" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17H19" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 21H19" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M23 17H27" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M23 21H27" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M31 17H35" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M31 21H35" />
                </svg>
            ),
        },
        {
            title: "Rich text support",
            description: "Bold, underline, italicize, and highlight text in different colors.",
            linkText: "Try it out",
            iconContent: (
                <svg className={iconBaseClasses} fill="none" viewBox="0 0 48 48" stroke="currentColor">
                    {/* Paths for the "Rich text support" icon, adjusted for a 48x48 viewBox */}
                    <rect x="6" y="12" width="36" height="24" rx="4" fill="white" strokeWidth="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 24h.01M20 24h.01M26 24h.01M32 24h.01" />
                    {/* B I U S - These are simplified placeholders to match the visual style */}
                    <text x="11" y="21" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="#3B82F6">B</text>
                    <text x="18" y="21" fontFamily="Arial, sans-serif" fontSize="10" fontStyle="italic" fill="#8B5CF6">I</text>
                    <text x="25" y="21" fontFamily="Arial, sans-serif" fontSize="10" textDecoration="underline" fill="#EC4899">U</text>
                    <text x="32" y="21" fontFamily="Arial, sans-serif" fontSize="10" textDecoration="line-through" fill="#F59E0B">S</text>
                </svg>
            ),
        },
        {
            title: "Classes",
            description: "Teachers can create classes to manage students, study materials and sections.",
            linkText: "Try it out",
            beta: true,
            studentsCount: 23,
            iconContent: (
                <svg className={iconBaseClasses} fill="none" viewBox="0 0 48 48" stroke="currentColor">
                    {/* Graduation cap icon */}
                    <path fill="#4A90E2" d="M24 6L2 18L24 30L46 18L24 6Z" />
                    <path fill="#4A90E2" d="M24 30L2 42V18L24 30Z" />
                    <path fill="#4A90E2" d="M24 30L46 18V42L24 30Z" />
                    <circle cx="24" cy="18" r="4" fill="#FFFFFF" /> {/* Example student head */}
                </svg>
            ),
        },
        {
            title: "Introducing Cortex",
            description: "Cortex helps you learn smarter with answer grading and more.",
            linkText: "Try it out",
            iconContent: (
                <div className="text-xs font-semibold text-gray-700 flex flex-col items-center justify-center w-full">
                    <span className="flex items-center mb-0.5">
                        <svg className="w-4 h-4 mr-1 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                        </svg>
                        <span>6/7</span>
                    </span>
                    <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                        <span>3/4</span>
                    </span>
                    <span className="mt-1 text-base font-bold text-gray-800 flex items-center">
                        {/* Cortex Logo SVG - this is a simplified circular logo for demonstration */}
                        <svg className="w-6 h-6 mr-1" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="24" cy="24" r="20" stroke="#4A90E2" strokeWidth="4" />
                            <path d="M24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4Z" fill="#4A90E2" />
                            <circle cx="24" cy="24" r="8" fill="#FFFFFF" />
                        </svg>
                        Cortex
                    </span>
                </div>
            ),
            progress: { completed: 6, total: 7 },
        },
    ];

    return (
        <div className="min-h-screen font-sans p-6 bg-gray-50">
            <PageMeta
                title="Lớp học tham gia | Thư viện của bạn"
                description="Khám phá các tính năng mới và lớp học bạn đã tham gia."
            />

            {/* Tabs + Search Bar */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center justify-between">
                <nav className="flex space-x-4 text-sm font-medium text-gray-700">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.path}
                            to={tab.path}
                            className={`py-2 px-4 rounded-lg transition-colors duration-200 ${location.pathname === tab.path
                                ? "bg-blue-100 text-blue-700"
                                : "hover:bg-gray-100 hover:text-gray-900"
                                }`}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </nav>

                <div className="relative flex items-center w-80">
                    <input
                        type="text"
                        placeholder="Tìm kiếm thẻ ghi nhớ"
                        className="w-full py-2 pl-4 pr-10 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    <svg
                        className="absolute right-3 text-gray-400 h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                    </svg>
                </div>
            </div>

            {/* Feature cards section */}
            <h2 className="text-lg font-bold text-gray-900 mb-8">Các lớp bạn đang tham gia</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {newFeatures.map((feature, index) => (
                    <NewFeatureCard key={index} {...feature} />
                ))}
            </div>
        </div>
    );
}