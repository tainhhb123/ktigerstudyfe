// src/components/document/homedocument/DocumentCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export interface Doc {
    listId: number;
    title: string;
    description: string;
    type: string;
    fullName: string;
    avatarImage?: string;
}

export default function DocumentCard({ doc }: { doc: Doc }) {
    return (
        <Link to={`/documents/view/${doc.listId}`}>
            <div className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 transition hover:shadow-md md:p-6">
                <h3 className="text-lg font-semibold text-gray-800">{doc.title}</h3>
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">{doc.description}</p>
                <span className="mt-3 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                    {doc.type}
                </span>
                <div className="mt-4 flex items-center gap-2">
                    <img
                        src={doc.avatarImage || 'https://via.placeholder.com/32'}
                        alt={doc.fullName}
                        className="h-6 w-6 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-800">{doc.fullName}</span>
                </div>
            </div>
        </Link>
    );
}
