import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FindDoctor from "../FindDoctorSearch/FindDoctorSearch";
import DoctorCard from "./DoctorCard";
const DoctorBook = () => {
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isSearched, setIsSearched] = useState(false);

  const getDoctorsDetails = () => {
    fetch(`https://api.npoint.io/e3c6cc64bf013781f538/doctors`)
      .then((res) => res.json())
      .then((data) => {
        if (searchParams.get("speciality")) {
          const filtered = data.filter(
            (doctor) =>
              doctor.speciality.toLowerCase() ===
              searchParams.get("speciality").toLowerCase()
          );
          setFilteredDoctors(filtered);
          setIsSearched(true);
          window.reload();
        } else {
          setFilteredDoctors([]);
          setIsSearched(false);
        }
        setDoctors(data);
      })
      .catch((err) => console.log(err));
  };
  const handleSearch = (searchText) => {
    if (searchText === "") {
      setFilteredDoctors([]);
      setIsSearched(false);
    } else {
      const filtered = doctors.filter((doctor) =>
        doctor.speciality.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredDoctors(filtered);
      setIsSearched(true);
      window.location.reload();
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    getDoctorsDetails();
  }, [searchParams]);

  return (
    <center>
      <div className="searchpage-container">
        <FindDoctor onSearch={handleSearch} />
        <div className="search-results-container">
          {isSearched ? (
            <center>
              <h2>
                {filteredDoctors.length} doctors available in{" "}
                {searchParams.get("location")}
              </h2>
              <h3>
                Book appointments with minimum wait-time & verified doctor
                details
              </h3>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <DoctorCard
                    className="doctorcard"
                    {...doctor}
                    key={doctor.name}
                  />
                ))
              ) : (
                <p>No doctors found.</p>
              )}
            </center>
          ) : (
            ""
          )}
        </div>
      </div>
    </center>
  );
};

export default DoctorBook;
