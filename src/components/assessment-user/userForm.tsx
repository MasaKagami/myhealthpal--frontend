import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
}

export default function UserForm() {
  const router = useRouter();
  const [user, setUser] = useState<User>({
    email: "",
    firstName: "",
    lastName: "",
    age: 0,
    gender: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: name === "age" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 

    if (e.currentTarget.checkValidity()) {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });

        if (!response.ok) {
          throw new Error("Failed to create user");
        }

        const data = await response.json();
        console.log("User created:", data);
        router.push("/assessment-medical");
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      e.currentTarget.reportValidity(); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label className="input input-bordered flex items-center gap-2">
        Email
        <input
          name="email"
          required
          type="email"
          className="grow"
          placeholder="john.doe@gmail.com"
          value={user.email}
          onChange={handleChange}
        />
      </label>
      <label className="input input-bordered flex items-center gap-2">
        First Name
        <input
          name="firstName"
          required
          type="text"
          className="grow"
          placeholder="John"
          value={user.firstName}
          onChange={handleChange}
        />
      </label>
      <label className="input input-bordered flex items-center gap-2">
        Last Name
        <input
          name="lastName"
          required
          type="text"
          className="grow"
          placeholder="Doe"
          value={user.lastName}
          onChange={handleChange}
        />
      </label>
      <label className="input input-bordered flex items-center gap-2">
        Age
        <input
          name="age"
          required
          type="number"
          className="grow"
          placeholder="27"
          value={user.age}
          onChange={handleChange}
        />
      </label>
      <select
        name="gender"
        className="select select-bordered w-full max-w-xs"
        value={user.gender}
        onChange={handleChange}
        required
      >
        <option value="" disabled>
          Gender
        </option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <button type="submit" className="btn btn-success mt-2 text-white" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}