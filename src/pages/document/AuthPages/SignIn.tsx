import PageMeta from "../../../components/document/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../../components/document/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="React.js SignIn Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js SignIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
