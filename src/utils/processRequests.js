export const processRequests = (requests, users, cars) => {
    if (!requests || !users || !cars) return [];
  
    return requests.map(request => {
      const userDetail = users.find(u => u.id === (request.userId || request.userID));
      let carDetails = 'Sconosciuta';
      
      const carIdValue = request.carId || request.carID;
      if (carIdValue) {
        if (Array.isArray(carIdValue)) {
          carDetails = carIdValue.map(id =>
            cars.find(c => c.id === id)?.licensePlate || 'ID Sconosciuto'
          ).filter(Boolean).join(', ') || 'Nessuna Targa';
        } else {
          carDetails = cars.find(c => c.id === carIdValue)?.licensePlate || 'Sconosciuta';
        }
      }

      console.log(userDetail?.fullName)
  
      return {
        ...request,
        userFullName: userDetail?.fullName || 'Sconosciuto',
        carDetails,
      };
    });
  };
  