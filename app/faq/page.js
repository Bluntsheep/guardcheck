"use client";
import React, { useState } from "react";
import Menubar from "../components/menubar/menubar";
import Footer from "../components/footer/footer";
import FaqBlock from "../components/faqBlocks/faqBlock";

const Home = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const updateTab = (e, index) => {
    console.log(index);

    if (selectedTab === index) {
      setSelectedTab(0);
      return;
    }

    setSelectedTab(index);
  };

  const faqInformationLeft = [
    {
      index: 1,
      heading: "Who can use this site?",
      content: "Only a PSIRA registered Security Company in South Africa.",
    },
    {
      index: 2,
      heading: "Why PSIRA registered?",
      content:
        "All security companies in South Africa must be registered with PSIRA, and have an authenticated PSIRA number issued.",
    },
    {
      index: 3,
      heading: "What does it cost to join Guardcheck?",
      content:
        "R 2850.00 per year in advance with no extra hidden costs billed to Guardcheck members.",
    },
    {
      index: 4,
      heading: "What do I get for my membership fee?",
      content:
        "* You can check a security guard to see if the guard has been blacklisted by another company and the reason for the listing. * You also have the facility to blacklist security guards as a Guardcheck Member. <br />* You will receive a database of CVs from Guards looking for jobs online with their Grade information.",
    },
    {
      index: 5,
      heading:
        "Do I pay extra for blacklisting and receiving reports on security guards?",
      content:
        "No, you pay a once-off fee of R1 550.00 per year and receive all features available to you at any time as a registered Guardcheck member.",
    },
    {
      index: 6,
      heading: "Do I pay to print CVs from Guardcheck?",
      content: "No, it is included in your R1 550.00 membership fee.",
    },
    {
      index: 7,
      heading: "Will I be billed automatically after one year?",
      content:
        "No, our website will send an alert that your membership is coming to an end, and will ask if our member would like to renew.",
    },
    {
      index: 8,
      heading: " How do I pay? <br /> There are 2(Two) options for payment:-",
      content:
        "* By credit card - you will receive your membership and password immediately via e-mail. <br /> * Internet transfer - information must be e-mailed to info@guardcheck.com and your membership and password will be forwarded to your address.",
    },
    {
      index: 9,
      heading: " Who can blacklist security guards?",
      content:
        "Any member of Guardcheck can and will be allowed to blacklist a security guard following fair disciplinary procedures.",
    },
    {
      index: 10,
      heading: "How long will the security guard be listed?",
      content:
        "The security guard will be listed for (5) Five years, or until the Guardcheck member who listed the security guard removes the guard from the blacklist database.",
    },
  ];
  const faqInformationRight = [
    {
      index: 11,
      heading: "Can the security guard be removed from the blacklist?",
      content:
        "Yes, but only by our Guardcheck member that listed the security guard.",
    },
    {
      index: 12,
      heading:
        "Does a company have to attach a security officer listing report to the security guard's letter of employment?",
      content:
        "Yes, this makes the security guard aware of their actions and that there are consequences now.",
    },
    {
      index: 13,
      heading: "How do I get a security officer's listing report?",
      content:
        "It is available to our Guardcheck members only, and can be printed off our website. Due to the regulations set by PSIRA the acceptance letter is not available for public download.",
    },
    {
      index: 14,
      heading: "How long does the security guard CV's stay on the website?",
      content: "removed off Guardcheck's database.",
    },
    {
      index: 15,
      heading:
        "Can a guard re-submit their CV if after 3(Three) months they still have not secured employment?",
      content: "Yes.",
    },
    {
      index: 16,
      heading: "What is the cost for uploading your CV to Guardcheck?",
      content:
        "Free of charge, as a security guard can re-enter their CV as many times as needed. We at Guardcheck want to assist guards in securing employment.",
    },
    {
      index: 17,
      heading: "What area does Guardcheck cover?",
      content:
        " Guardcheck covers all regions belonging to South Africa, the updated information is sent out to our proud growing database of over 4000+ Guardcheck members.",
    },
    {
      index: 18,
      heading:
        "If a security guard is blacklisted can a company still hire the security guard?",
      content:
        "Yes, we are just providing information so that the security industry can make an informed decision when hiring their employees.",
    },
    {
      index: 19,
      heading: "How do I contact the team?",
      content: "Please refer to the contact details on our website.",
    },
  ];

  return (
    <div class="row clearfix">
      <Menubar />
      <div className=" px-[12%] mt-12">
        <div>
          <p className=" font-medium">{`FAQ'S`}</p>
          <p className=" font-bold text-4xl mt-3">General Questions</p>
        </div>
        <div className="flex justify-between mt-12 gap-10">
          <div className="w-full">
            {faqInformationLeft.map((item) => (
              <FaqBlock
                key={item.index}
                heading={item.heading}
                content={item.content}
                selectedTab={selectedTab}
                updateTab={updateTab}
                index={item.index}
              />
            ))}
          </div>
          <div className="w-full">
            {faqInformationRight.map((item) => (
              <FaqBlock
                key={item.index}
                heading={item.heading}
                content={item.content}
                selectedTab={selectedTab}
                updateTab={updateTab}
                index={item.index}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
