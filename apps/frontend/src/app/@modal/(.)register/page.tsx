import InterceptorModal from "../../../components/interceptor-modal";
import RegisterForm from "../../../components/register-form";

export default function Page() {
  return (
    <InterceptorModal title="Create New Account">
      <RegisterForm />
    </InterceptorModal>
  );
}
