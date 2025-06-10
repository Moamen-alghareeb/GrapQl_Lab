import { useQuery, useMutation, gql } from '@apollo/client';
import { useState } from 'react';

const GET_DRIVERS = gql`
  query GetDrivers {
    drivers {
      id
      name
      age
      cars {
        name
        model
      }
    }
  }
`;

const ADD_CAR = gql`
  mutation AddCar($driverId: ID!, $name: String!, $model: String!) {
    addCar(driverId: $driverId, name: $name, model: $model) {
      id
      name
      model
    }
  }
`;

const ADD_DRIVER = gql`
  mutation AddDriver($name: String!, $age: Int!) {
    addDriver(name: $name, age: $age) {
      id
      name
      age
    }
  }
`;

function App() {
  const { loading, error, data, refetch } = useQuery(GET_DRIVERS);
  const [addCar] = useMutation(ADD_CAR);
  const [addDriver] = useMutation(ADD_DRIVER, {
    onCompleted: () => refetch(),
  });

  const [carForm, setCarForm] = useState({
    driverId: '',
    name: '',
    model: '',
  });

  const [driverForm, setDriverForm] = useState({
    name: '',
    age: '',
  });

  const handleAddCar = (e) => {
    e.preventDefault();
    addCar({
      variables: {
        driverId: carForm.driverId,
        name: carForm.name,
        model: carForm.model,
      },
    }).then(() => {
      refetch();
      setCarForm({ driverId: '', name: '', model: '' });
    });
  };

  const handleAddDriver = (e) => {
    e.preventDefault();
    addDriver({
      variables: {
        name: driverForm.name,
        age: parseInt(driverForm.age),
      },
    }).then(() => {
      setDriverForm({ name: '', age: '' });
    });
  };

  if (loading) return <p style={{ color: 'white' }}>Loading...</p>;
  if (error) {
    console.log(error);
    return <p style={{ color: 'white' }}>Error loading drivers.</p>;
  }

  return (
    <div
      style={{
        backgroundColor: 'black',
        color: 'white',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: 'Arial',
      }}
    >
      <h1 style={{ marginBottom: '30px' }}>Drivers & Their Cars</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {data.drivers.map((driver) => (
          <div
            key={driver.id}
            style={{
              backgroundColor: '#1a1a1a',
              border: '1px solid white',
              borderRadius: '10px',
              padding: '15px',
              width: '300px',
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              {driver.name} ({driver.age})
            </h2>
            <h3>Cars:</h3>
            <ul style={{ paddingLeft: '20px' }}>
              {driver.cars.length > 0 ? (
                driver.cars.map((car, index) => (
                  <li key={index}>
                    {car.name} - {car.model}
                  </li>
                ))
              ) : (
                <li>No cars added yet</li>
              )}
            </ul>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: '40px' }}>Add a Car</h2>
      <form onSubmit={handleAddCar} style={{ marginBottom: '30px' }}>
        <select
          value={carForm.driverId}
          onChange={(e) => setCarForm({ ...carForm, driverId: e.target.value })}
          required
          style={{
            padding: '8px',
            marginBottom: '10px',
            backgroundColor: 'white',
            color: 'black',
            width: '20%',
          }}
        >
          <option value="">Select Driver</option>
          {data.drivers.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {driver.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Car Name"
          value={carForm.name}
          onChange={(e) => setCarForm({ ...carForm, name: e.target.value })}
          required
          style={{ padding: '8px', marginBottom: '10px', width: '20%' }}
        />
        <input
          type="text"
          placeholder="Car Model"
          value={carForm.model}
          onChange={(e) => setCarForm({ ...carForm, model: e.target.value })}
          required
          style={{ padding: '8px', marginBottom: '10px', width: '20%' }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: 'white',
            color: 'black',
            border: 'none',
          }}
        >
          Add Car
        </button>
      </form>

      <h2>Add a Driver</h2>
      <form onSubmit={handleAddDriver}>
        <input
          type="text"
          placeholder="Driver Name"
          value={driverForm.name}
          onChange={(e) =>
            setDriverForm({ ...driverForm, name: e.target.value })
          }
          required
          style={{ padding: '8px', marginBottom: '10px', width: '20%' }}
        />
        <input
          type="number"
          placeholder="Driver Age"
          value={driverForm.age}
          onChange={(e) =>
            setDriverForm({ ...driverForm, age: e.target.value })
          }
          required
          style={{ padding: '8px', marginBottom: '10px', width: '20%' }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: 'white',
            color: 'black',
            border: 'none',
          }}
        >
          Add Driver
        </button>
      </form>
    </div>
  );
}

export default App;
