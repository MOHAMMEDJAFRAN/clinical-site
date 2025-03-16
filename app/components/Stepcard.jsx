"use client";
import React from "react";
import Image from "next/image";

const steps = [
  {
    title: "Check Doctor Profile",
    description:
      "Before booking a consultation, it is important to review the doctor’s profile to ensure they meet your needs. This step allows you to check the doctor’s qualifications, specialization, hospital affiliation, and availability. You can also read patient reviews and ratings to make an informed decision. Having access to a detailed profile helps you choose a doctor who is best suited to address your health concerns.",
    image: "/assets/check_profile.png", // Replace with your actual image path
  },
  {
    title: "Request Consultation",
    description:
      "Once you have selected a doctor, the next step is to request a consultation. This can be done by selecting an available time slot and submitting a request. Some doctors may offer virtual consultations, while others may require an in-person visit. At this stage, you may need to provide basic information about your health condition or reason for the appointment. A confirmation message will be sent after your request is processed, ensuring that your consultation is scheduled successfully.",
    image: "/assets/request.png", // Replace with your actual image path
  },
  {
    title: "Receive Your Consultation",
    description:
      "At the scheduled time, you will meet with the doctor either in person or through an online platform. During the consultation, the doctor will evaluate your condition, ask relevant questions, and provide medical advice or treatment options. It is important to communicate all necessary details regarding your symptoms, medical history, and concerns. The doctor may also prescribe medication, suggest further tests, or recommend follow-up visits based on the consultation.",
    image: "/assets/receive.png", // Replace with your actual image path
  },
  {
    title: "Get Your Solution",
    description:
      "After your consultation, you will receive a diagnosis, treatment plan, or necessary medical advice. If medication is prescribed, you can collect it from a pharmacy, and if further tests are needed, you will be guided on the next steps. Many healthcare providers also offer post-consultation support to address any follow-up questions or concerns. Ensuring that you follow the doctor’s advice and recommendations will help you manage your health effectively and work toward recovery.",
    image: "/assets/solution.png", // Replace with your actual image path
  },
];

const StepsCard = () => {
  return (
    <div className="py-12 mt-[-70] px-4">
      <h2 className="text-2xl  text-red-500 font-bold text-center mb-15">
        4 Easy Steps and Get Your Solution
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 pl-20 pr-20 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className=" bg-blue-50 p-6 m-0.5 rounded-lg shadow-1xs shadow-blue-400 flex flex-col items-center text-center hover:shadow-md cursor-pointer hover:scale-102 transition-all duration-300"
          >
            <div className="bg-gray-400 p-4 rounded-3xl shadow-md mb-4">
              <Image
                src={step.image}
                alt={step.title}
                width={50}
                height={50}
                className="object-contain"
              />
            </div>
            <h3 className="font-semibold text-gray-700 text-lg">{step.title}</h3>
            <p className="text-gray-400 text-justify mt-2 text-sm">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepsCard;
