import { getPetNotApprovedAPI, approvePetAPI } from "@/apis/pet";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const ApprovePet = () => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPetNotApprovedAPI();
        setPets(response.data.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };
    fetchData();
  }, []);

  const handleApprove = async (petId) => {
    try {
      await approvePetAPI(petId);
      setPets((prevPets) => prevPets.filter((pet) => pet._id !== petId));
    } catch (error) {
      console.error("Error approving pet:", error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Approve Pets</h1>
      {pets?.length === 0 ? (
        <p className="text-gray-500">No pets waiting for approval.</p>
      ) : (
        <div className="space-y-4">
          {pets?.map((pet) => (
            <Card
              key={pet._id}
              className="p-4 flex items-center justify-between"
            >
              <Button
                onClick={() => handleApprove(pet._id)}
                className="bg-green-500 hover:bg-green-600"
              >
                Approve
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovePet;
