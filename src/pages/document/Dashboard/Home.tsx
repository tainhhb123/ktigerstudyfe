import EcommerceMetrics from "../../../components/document/homedocument/DocumentItem";
import PageMeta from "../../../components/document/common/PageMeta";
import { Link } from "react-router-dom";


export default function Home() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 flex items-center justify-between">
          <p className="text-base font-semibold text-gray-800 dark:text-white">
            Tài liệu gợi ý cho bạn
          </p>
          <Link
            to="/tailieu"
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            Xem thêm
          </Link>
        </div>

        <div className="col-span-12  ">
          <EcommerceMetrics />
        </div>

      </div>
    </>
  );
}
