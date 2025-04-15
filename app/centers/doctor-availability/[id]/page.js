// app/centers/doctor-availability/[id]/page.tsx
import ManageDoctorAvailability from '../ManageDoctorAvailability';

const Page = async ({ params }) => {
  const currentClinic = {
    id: parseInt(params.id),
    name: 'Some Clinic Name', // You may fetch from DB here
  };

  return <ManageDoctorAvailability currentClinic={currentClinic} />;
};

export default Page;
