import FlashcardHeader from "../../../components/document/homedocument/DocumentDetail";
import PageMeta from "../../../components/document/common/PageMeta";
import { Link } from "react-router";


export default function DocumentDe() {
    return (
        <>
            <PageMeta
                title="học tiếng hàn"
                description=""
            />
            <div className="grid grid-cols-12 gap-4 md:gap-6">


                <div className="col-span-12  ">
                    <FlashcardHeader />
                </div>

            </div>
        </>
    );
}
