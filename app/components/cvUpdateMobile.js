import { useRouter } from "next/navigation";
import React from "react";
import { FaRegCopy } from "react-icons/fa";

const CvUpdatemobile = () => {
  const router = useRouter();

  const handleCVSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const selectedGuardTypesArray = formData.getAll("guard_type");
    let finalGuardTypeString = selectedGuardTypesArray;

    const currentdate = formData.get("date");

    console.log("date", currentdate);

    if (currentdate.length > 0) {
      console.log("Cv Uploaded...");
      return;
    } else {
      const formObject = {};
      formData.forEach((value, key) => {
        formObject[key] = value;
      });

      if (selectedGuardTypesArray.length > 0) {
        const multiple = (finalGuardTypeString =
          selectedGuardTypesArray.join(", "));
        formObject.guard_type = multiple;
      } else {
        formObject.guard_type = finalGuardTypeString;
      }

      console.log(formObject);

      try {
        const response = await fetch("/api/cvUpload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formObject),
        });

        const data = await response.json();

        if (response.ok) {
          console.log("CV Uploaded");
          router.push("/");
        } else {
          console.log("CV Upload Failed. Please try again.");
        }
      } catch (error) {
        console.error("Frontend CV Upload error:", error);
      }
    }
  };

  return (
    <div className="flex md:hidden bg-[#FAFAFA] w-full">
      <div className="w-full">
        <div className="flex bg-[#167BA9] justify-around p-5 mb-5">
          <div className="bg-white p-8 rounded-full">
            <FaRegCopy color="grey" size={50} />
          </div>
          <div className="flex flex-col justify-center text-center text-white font-bold text-2xl">
            <p>SUBMIT</p>
            <p>SECURITY</p>
            <p>GUARD CV</p>
          </div>
        </div>

        <form onSubmit={handleCVSubmit}>
          <div className="items-center">
            <div className="w-full text-center">
              <input
                name="name"
                className="w-[80%] mt-3 bg-slate-200 p-3 text-lg"
                placeholder="Name"
              />
              <input
                name="surname"
                className="w-[80%] mt-3 bg-slate-200 p-3 text-lg"
                placeholder="Surname"
              />
            </div>
            <div className="w-full text-center">
              <input
                name="idnum"
                className="w-[80%] mt-3 bg-slate-200 p-3 text-lg"
                placeholder="Id Number"
              />
              <input
                name="snum"
                className="w-[80%] mt-3 bg-slate-200 p-3 text-lg"
                placeholder="PSIRA Number"
              />
            </div>
            <div className="w-full text-center">
              <input
                name="phonenum"
                className="w-[80%] mt-3 bg-slate-200 p-3 text-lg"
                placeholder="Phone"
              />
              <select
                className="bg-slate-200 p-3 text-lg w-[80%] mt-3"
                id="g_area"
                name="g_area">
                <option value="Select Region">Select Region</option>
                <option value="EC">Eastern Cape</option>
                <option value="FS">Free State</option>
                <option value="GP">Gauteng</option>
                <option value="KZN">Kwazulu-Natal</option>
                <option value="PM">Mpumalanga</option>
                <option value="NC">Northen Cape</option>
                <option value="LP">Limpopo</option>
                <option value="NWP">North West Province</option>
                <option value="WC">Western Cape</option>
              </select>
            </div>
            <div className="w-full text-center">
              <input
                name="town"
                className="w-[80%] mt-3 bg-slate-200 p-3 text-lg"
                placeholder="Town"
              />
              <select
                name="g_hgrade"
                className="bg-slate-200 p-3 text-lg w-[80%] mt-3">
                <option value="Select Highest Grade">
                  Select Highest Grade
                </option>
                <option value="Grade A">A</option>
                <option value="Grade B">B</option>
                <option value="Grade C">C</option>
                <option value="Grade D">D</option>
              </select>
            </div>
            <div className="flex w-full mt-5 gap-8 justify-center text-xs">
              <div>
                <label>
                  <input value="male" name="gender" type="radio" />
                  <span className="ml-2">Male</span>
                </label>
              </div>
              <div>
                <label>
                  <input value="female" name="gender" type="radio" />
                  <span className="ml-2">Female</span>
                </label>
              </div>
            </div>
            <div className="flex gap-8 mt-5 justify-center">
              <textarea
                name="pexp"
                className="w-[90%] bg-slate-200 p-3"
                rows={5}
                placeholder="Personal Experience"
              />
            </div>
            <div className="text-xs mt-5 pl-3">
              <p>Guard Type:</p>
            </div>
            <div className="text-xs px-5 mt-5 flex gap-2 justify-around text-center">
              <label className="ml-2">
                <input
                  value="Security guard"
                  type="checkbox"
                  name="guard_type"
                />
                <span className="">Security guard</span>
              </label>
              <label className="">
                <input
                  value="Armed response"
                  type="checkbox"
                  name="guard_type"
                />
                <span className="">Armed response</span>
              </label>
              <label className="">
                <input value="Control room" type="checkbox" name="guard_type" />
                <span className="ml-2">Control room</span>
              </label>
            </div>
            <input name="date" className="hidden" defaultValue="" />
            <div className="w-full flex justify-center">
              <button
                type="submit"
                className="bg-[#167BA9] text-white p-3 mt-8 rounded-md w-[30%] text-center hover:bg-[#0F5A7B] transition-colors duration-300">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CvUpdatemobile;
