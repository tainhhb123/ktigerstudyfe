// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import DocumentCard from '../../../components/document/homedocument/DocumentCard';

// // Định nghĩa kiểu dữ liệu cho document
// interface Doc {
//     listId: number;
//     title: string;
//     description: string;
//     type: string;
// }

// export default function DocumentTypePage() {
//     const { type } = useParams<{ type: string }>();
//     const [docs, setDocs] = useState<Doc[]>([]);

//     useEffect(() => {
//         if (!type) return;
//         fetch(
//             `${import.meta.env.VITE_API_BASE_URL}/document-lists/type/${encodeURIComponent(type)}`
//         )
//             .then(res => {
//                 if (!res.ok) throw new Error('Network response was not ok');
//                 return res.json();
//             })
//             .then((data: Doc[]) => setDocs(data))
//             .catch(err => console.error('Fetch documents by type error:', err));
//     }, [type]);

//     return (
//         <div className="space-y-4 px-4 py-6">
//             <h1 className="text-2xl font-bold capitalize">{type}</h1>
//             {docs.length === 0 ? (
//                 <p className="text-gray-500">Không có tài liệu nào cho loại này.</p>
//             ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                     {docs.map(doc => (
//                         <DocumentCard key={doc.listId} doc={doc} />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }
