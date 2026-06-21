"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import DependencyGraph from "../pages/DependencyGraph";

function Dashboard() {
  const [sourceServiceId,
setSourceServiceId] = useState("");

const [targetServiceId,
setTargetServiceId] = useState("");
  const [summary, setSummary] = useState({});
  const [services, setServices] = useState([]);
  const [dependencies, setDependencies] = useState([]);

  const [selectedService, setSelectedService] = useState("");
  const [impactedServices, setImpactedServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const [simulations, setSimulations] =
  useState([]);

  const [searchTerm, setSearchTerm] =
  useState("");

const [statusFilter,
setStatusFilter] =
  useState("ALL");
  const [impactPath, setImpactPath] =
  useState([]);

  //here i'm  Add Service States
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [description, setDescription] = useState("");
  const [criticality, setCriticality] =
    useState("MEDIUM");
  const [editingService, setEditingService] =
  useState(null);

const [editName, setEditName] =
  useState("");

const [editOwner, setEditOwner] =
  useState("");

const [
  editDescription,
  setEditDescription,
] = useState("");

const [
  editCriticality,
  setEditCriticality,
] = useState("MEDIUM");

const [editStatus, setEditStatus] =
  useState("HEALTHY");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const summaryRes = await api.get(
        "/dashboard"
      );

      const servicesRes = await api.get(
        "/services"
      );

      const dependenciesRes =
        await api.get(
          "/dependencies"
        );

      const simulationsRes =
  await api.get("/simulations");

      setSummary(summaryRes.data);
      setServices(servicesRes.data);
      setDependencies(
        dependenciesRes.data
      );
      setSimulations(
  simulationsRes.data
);
    } catch (error) {
      console.log(error);
    }
  };

  const simulateFailure = async () => {
    if (!selectedService) {
      alert("Please select a service");
      return;
    }

    setLoading(true);

    try {
      const response = await api.get(
        `/blast-radius/${selectedService}`
      );

      setImpactedServices(
        response.data
          .impactedServices || []
      );

      const path =
  getDependencyPath(
    selectedService,
    response.data
      .impactedServices[0]
  );

if (path) {
  setImpactPath(path);
}

      const selectedServiceName =
  services.find(
    (service) =>
      service.id === selectedService
  )?.name;

    const impactedCount =
  response.data
    .impactedServices.length;

let severity = "LOW";

if (impactedCount >= 4) {
  severity = "HIGH";
} else if (
  impactedCount >= 2
) {
  severity = "MEDIUM";
}

await api.post(
  "/simulations",
  {
    failedService:
      selectedServiceName,
    impactedServices:
      response.data
        .impactedServices || [],
    impactedCount,
    severityScore:
      severity,
  }
);
fetchData();
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };
  const hasPath = (
  startId,
  endId
) => {
  const visited = new Set();

  const dfs = (currentId) => {
    if (
      currentId === endId
    ) {
      return true;
    }

    visited.add(
      currentId
    );

    const children =
      dependencies.filter(
        (dependency) =>
          dependency.sourceServiceId ===
          currentId
      );

    for (const child of children) {
      if (
        !visited.has(
          child.targetServiceId
        )
      ) {
        if (
          dfs(
            child.targetServiceId
          )
        ) {
          return true;
        }
      }
    }

    return false;
  };

  return dfs(startId);
};

const getDependencyPath = (
  startId,
  endId
) => {
  const visited = new Set();

  const dfs = (
    currentId,
    path
  ) => {
    if (
      currentId === endId
    ) {
      return [
        ...path,
        currentId,
      ];
    }

    visited.add(
      currentId
    );

    const children =
      dependencies.filter(
        (dependency) =>
          dependency.sourceServiceId ===
          currentId
      );

    for (const child of children) {
      if (
        !visited.has(
          child.targetServiceId
        )
      ) {
        const result =
          dfs(
            child.targetServiceId,
            [
              ...path,
              currentId,
            ]
          );

        if (result) {
          return result;
        }
      }
    }

    return null;
  };

  return dfs(startId, []);
};

// addDependency 

const addDependency = async () => {
  if (
    !sourceServiceId ||
    !targetServiceId
  ) {
    alert(
      "Please select both services"
    );
    return;
  }

  if (
    sourceServiceId ===
    targetServiceId
  ) {
    alert(
      "A service cannot depend on itself"
    );
    return;
  }

  const alreadyExists =
    dependencies.some(
      (dependency) =>
        dependency.sourceServiceId ===
          sourceServiceId &&
        dependency.targetServiceId ===
          targetServiceId
    );

  if (alreadyExists) {
    alert(
      "Dependency already exists"
    );
    return;
  }

  if (
    hasPath(
      targetServiceId,
      sourceServiceId
    )
  ) {
    alert(
      "Circular dependency detected"
    );
    return;
  }

  try {
    await api.post(
      "/dependencies",
      {
        sourceServiceId,
        targetServiceId,
      }
    );

    alert(
      "Dependency Added Successfully"
    );

    setSourceServiceId("");
    setTargetServiceId("");

    fetchData();
  } catch (error) {
    console.log(error);
  }
};

  const addService =
  async () => {
    const exists =
  services.some(
    (service) =>
      (service.name || "")
        .toLowerCase()
        .trim() ===
      name
        .toLowerCase()
        .trim()
  );
    if (exists) {
      alert(
        "Service already exists"
      );
      return;
    }

    if (
      !name ||
      !owner ||
      !description
    ) {
      alert(
        "Please fill all fields"
      );
      return;
    }

    try {
      await api.post(
        "/services",
        {
          name,
          owner,
          description,
          criticality,
        }
      );

      alert(
        "Service Added Successfully"
      );

      setName("");
      setOwner("");
      setDescription("");
      setCriticality(
        "MEDIUM"
      );

      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteService = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this service?"
  );

  if (!confirmed) return;

  try {
    await api.delete(
      `/services/${id}`
    );

    alert(
      "Service deleted successfully"
    );

    fetchData();
  } catch (error) {
    console.log(error);
  }
};

const deleteDependency =
  async (id) => {
    const confirmed =
      window.confirm(
        "Delete this dependency?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/dependencies/${id}`
      );

      alert(
        "Dependency deleted successfully"
      );

      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

const openEdit = (service) => {
  setEditingService(service.id);

  setEditName(service.name);
  setEditOwner(service.owner);
  setEditDescription(
    service.description
  );

  setEditCriticality(
    service.criticality
  );

  setEditStatus(
    service.status
  );
};

const updateService = async () => {
  if (
    !editName ||
    !editOwner ||
    !editDescription
  ) {
    alert(
      "Please fill all fields"
    );
    return;
  }

  try {
    await api.patch(
      `/services/${editingService}`,
      {
        name: editName,
        owner: editOwner,
        description:
          editDescription,
        criticality:
          editCriticality,
        status:
          editStatus,
      }
    );

    alert(
      "Service Updated Successfully"
    );

    setEditingService(null);

    setEditName("");
    setEditOwner("");
    setEditDescription("");
    setEditCriticality(
      "MEDIUM"
    );
    setEditStatus(
      "HEALTHY"
    );

    fetchData();
  } catch (error) {
    console.log(error);
  }
};

  const filteredServices =
  services.filter((service) => {
    const matchesSearch =
      (service.name || "")
  .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );

    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : service.status ===
          statusFilter;

    return (
      matchesSearch &&
      matchesStatus
    );
  });

  const mostDependentService =
  services.reduce(
    (max, service) => {
      const count =
        dependencies.filter(
          (dependency) =>
            dependency.targetServiceId ===
            service.id
        ).length;

      return count >
        max.count
        ? {
            service,
            count,
          }
        : max;
    },
    {
      service: null,
      count: 0,
    }
  );

  //return part.......................

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      
   <h2
  className="
  text-3xl
  font-bold
  mt-16
  mb-6"
>
  System Visualization
</h2>

<DependencyGraph
  services={services}
  dependencies={dependencies}
/>
   <h2
  style={{
    marginTop: "40px",
    color: "skyblue",
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "20px",
  }}
>
  Add Dependency
</h2>

<div
  style={{
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: "30px",
  }}
>

  
  {/* Source */}
  <select
    value={sourceServiceId}
    onChange={(e) =>
      setSourceServiceId(e.target.value)
    }
    style={{
      padding: "12px 15px",
      borderRadius: "12px",
      width: "250px",
      backgroundColor: "#0f172a",
      color: "skyblue",
      border: "1px solid #38bdf8",
      outline: "none",
      fontSize: "16px",
      boxShadow: "0 0 10px rgba(56,189,248,0.2)",
    }}
  >
    <option value="">Source Service</option>

    {services.map((service) => (
      <option
        key={service.id}
        value={service.id}
      >
        {service.name}
      </option>
    ))}
  </select>

  {/* Target */}
  <select
    value={targetServiceId}
    onChange={(e) =>
      setTargetServiceId(e.target.value)
    }
    style={{
      padding: "12px 15px",
      borderRadius: "12px",
      width: "250px",
      backgroundColor: "#0f172a",
      color: "skyblue",
      border: "1px solid #38bdf8",
      outline: "none",
      fontSize: "16px",
      boxShadow: "0 0 10px rgba(56,189,248,0.2)",
    }}
  >
    <option value="">Target Service</option>

    {services.map((service) => (
      <option
        key={service.id}
        value={service.id}
      >
        {service.name}
      </option>
    ))}
  </select>

  <button
    onClick={addDependency}
    style={{
      padding: "12px 22px",
      borderRadius: "12px",
      background:
        "linear-gradient(90deg,#0ea5e9,#38bdf8)",
      color: "white",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "16px",
      boxShadow:
        "0 0 15px rgba(56,189,248,0.4)",
    }}
  >
    Add Dependency
  </button>
</div>

{/* Simulation History */}

<h2
  className="text-3xl font-bold mt-16 mb-6"
>
  Simulation History
</h2>

{simulations.length === 0 ? (
  <p className="text-gray-400">
    No simulations found.
  </p>
) : (
  <div className="grid md:grid-cols-2 gap-6">
    {simulations.map((simulation) => (
      <div
        key={simulation.id}
        className="
          bg-[#0f172a]
          border
          border-slate-700
          rounded-2xl
          p-6
          shadow-lg
        "
      >
        <h3
          className="
            text-xl
            font-bold
            text-sky-400
            mb-4
          "
        >
          Failed Service
        </h3>

        <p className="mb-2">
          {simulation.failedService}
        </p>

        <p className="mb-2">
          Impacted Count :
          {" "}
          {simulation.impactedCount}
        </p>

        <p className="mb-2">
  Severity:
  <span
    className={`
      ml-2
      px-3
      py-1
      rounded-full
      font-semibold
      ${
        simulation.severityScore ===
        "HIGH"
          ? "bg-red-600"
          : simulation.severityScore ===
            "MEDIUM"
          ? "bg-yellow-500"
          : "bg-green-600"
      }
    `}
  >
    {simulation.severityScore}
  </span>
</p>

        <p className="text-gray-400">
          {new Date(
            simulation.createdAt
          ).toLocaleString()}
        </p>
      </div>
    ))}
  </div>
)}

      {/* Header */}
      <h1 className="text-4xl font-bold mb-8">
        Dependency Blast Radius
        Dashboard
      </h1>

      <button
        onClick={fetchData}
        className="
          bg-blue-600
          hover:bg-blue-700
          px-5
          py-3
          rounded-xl
          font-semibold
          mb-10
          transition
        "
      >
        Refresh Dashboard
      </button>

      {/* Summary Cards */}
      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-4
        gap-6
        mb-12
      ">
        <div className="
bg-slate-900
border
border-slate-700
rounded-2xl
p-6
text-center
shadow-lg
hover:scale-105
hover:border-sky-500
transition
duration-300
">
          <h3 className="text-gray-400">
            Total Services
          </h3>

          <h1 className="
            text-5xl
            font-bold
            mt-4
          ">
            {
              summary.totalServices
            }
          </h1>
        </div>

        <div className="
          bg-slate-900
          border
          border-slate-700
          rounded-2xl
          p-6
          text-center
          shadow-lg
        ">
          <h3 className="text-gray-400">
            Healthy
          </h3>

          <h1 className="
            text-5xl
            font-bold
            text-green-500
            mt-4
          ">
            {
              summary.healthyServices
            }
          </h1>
        </div>

        <div className="
          bg-slate-900
          border
          border-slate-700
          rounded-2xl
          p-6
          text-center
          shadow-lg
        ">
          <h3 className="text-gray-400">
            Down
          </h3>

          <h1 className="
            text-5xl
            font-bold
            text-red-500
            mt-4
          ">
            {
              summary.downServices
            }
          </h1>
        </div>

        <div className="
          bg-slate-900
          border
          border-slate-700
          rounded-2xl
          p-6
          text-center
          shadow-lg
        ">
          <h3 className="text-gray-400">
            Dependencies
          </h3>

          <h1 className="
            text-5xl
            font-bold
            text-cyan-400
            mt-4
          ">
            {
              summary.totalDependencies
            }
          </h1>
        </div>
      </div>

      {/* Add Service */}
      <div className="
        bg-slate-900
        border
        border-slate-700
        rounded-2xl
        p-6
        mb-12
      ">
        <h2 className="
          text-2xl
          font-bold
          mb-6
        ">
          Add Service
        </h2>

        <div className="
          grid
          md:grid-cols-2
          gap-4
        ">
          <input
            type="text"
            placeholder="Service Name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            className="
              bg-slate-800
              border
              border-slate-600
              rounded-xl
              p-3
            "
          />

          <input
            type="text"
            placeholder="Owner"
            value={owner}
            onChange={(e) =>
              setOwner(
                e.target.value
              )
            }
            className="
              bg-slate-800
              border
              border-slate-600
              rounded-xl
              p-3
            "
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            className="
              bg-slate-800
              border
              border-slate-600
              rounded-xl
              p-3
            "
          />

          <select
            value={
              criticality
            }
            onChange={(e) =>
              setCriticality(
                e.target.value
              )
            }
            className="
              bg-slate-800
              border
              border-slate-600
              rounded-xl
              p-3
            "
          >
            <option value="LOW">
              LOW
            </option>

            <option value="MEDIUM">
              MEDIUM
            </option>

            <option value="HIGH">
              HIGH
            </option>
          </select>
        </div>

        <button
          onClick={
            addService
          }
          className="
bg-green-600
hover:bg-green-500
hover:scale-105
transition
duration-300
px-6
py-3
rounded-xl
font-semibold
mt-6
"
        >
          Add Service
        </button>
      </div>

{/* Blast Radius */}


      <div className="
        bg-slate-900
        border
        border-slate-700
        rounded-2xl
        p-6
        mb-12
      ">
        <h2 className="
          text-2xl
          font-bold
          mb-6
        ">
          Blast Radius Simulator
        </h2>

        <div className="
          flex
          flex-col
          md:flex-row
          gap-4
        ">
          <select
            value={
              selectedService
            }
            onChange={(e) =>
              setSelectedService(
                e.target.value
              )
            }
            className="
              bg-slate-800
              border
              border-slate-600
              rounded-xl
              px-4
              py-3
              w-full
              md:w-80
            "
          >
            <option value="">
              Select Service
            </option>

            {services.map(
              (service) => (
                <option
                  key={
                    service.id
                  }
                  value={
                    service.id
                  }
                >
                  {service.name}
                </option>
              )
            )}
          </select>

          <button
            onClick={
              simulateFailure
            }
            disabled={
              !selectedService
            }
            className={`
              px-6
              py-3
              rounded-xl
              font-semibold
              transition
              ${
                selectedService
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-700 cursor-not-allowed"
              }
            `}
          >
            {loading
              ? "Loading..."
              : "Simulate Failure"}
          </button>
        </div>

        <h3 className="
          text-xl
          font-semibold
          mt-8
          mb-4
        ">
          Impacted Services
        </h3>

        <h3
  className="
    text-2xl
    font-bold
    mt-8
    mb-4
  "
>
  Dependency Path
</h3>

{impactPath.length === 0 ? (
  <p className="text-gray-400">
    No dependency path found.
  </p>
) : (
  <div
    className="
      bg-slate-900
      border
      border-slate-700
      rounded-xl
      p-6
    "
  >
    {impactPath.map(
      (
        serviceId,
        index
      ) => {
        const service =
          services.find(
            (s) =>
              s.id ===
              serviceId
          );

        return (
          <div
            key={
              serviceId
            }
            className="
              flex
              items-center
              gap-4
              mb-3
            "
          >
            <div
              className="
                bg-sky-600
                px-4
                py-2
                rounded-lg
              "
            >
              {
                service?.name
              }
            </div>

            {index <
              impactPath.length -
                1 && (
              <span
                className="
                  text-2xl
                  text-sky-400
                "
              >
                ↓
              </span>
            )}
          </div>
        );
      }
    )}
  </div>
)}

        {impactedServices
          .length === 0 ? (
          <p className="text-gray-400">
            No impacted services
            found.
          </p>
        ) : (
          <div className="
            space-y-3
          ">
            {impactedServices.map(
              (
                service,
                index
              ) => (
                <div
                  key={index}
                  className="
                    bg-red-950
                    border
                    border-red-500
                    p-4
                    rounded-xl
                  "
                >
                  🔥 {service}
                </div>
              )
            )}
          </div>
        )}
      </div>

      

<div className="flex flex-col md:flex-row gap-4 mt-12 mb-8">
  <input
    type="text"
    placeholder="Search Service..."
    value={searchTerm}
    onChange={(e) =>
      setSearchTerm(e.target.value)
    }
    className="
      w-full
      md:w-96
      p-4
      rounded-xl
      bg-slate-800
      border
      border-slate-600
      text-white
      outline-none
      focus:border-sky-400
    "
  />

  <select
    value={statusFilter}
    onChange={(e) =>
      setStatusFilter(
        e.target.value
      )
    }
    className="
      p-4
      rounded-xl
      bg-slate-800
      border
      border-slate-600
      text-white
    "
  >
    <option value="ALL">
      All Status
    </option>

    <option value="HEALTHY">
      Healthy
    </option>

    <option value="DOWN">
      Down
    </option>

    <option value="DEGRADED">
      Degraded
    </option>
  </select>
</div>







{/* insights UI */}

<h2
  className="
    text-3xl
    font-bold
    mt-10
    mb-6
  "
>
  Insights
</h2>

<div
  className="
    bg-slate-900
    border
    border-slate-700
    rounded-2xl
    p-6
    space-y-4
    mb-10
  "
>
  <p>
    📦 Total Services:
    <span
      className="
        text-sky-400
        ml-2
      "
    >
      {services.length}
    </span>
  </p>

  <p>
    🔗 Total Dependencies:
    <span
      className="
        text-sky-400
        ml-2
      "
    >
      {dependencies.length}
    </span>
  </p>

  <p>
    ⚠ Most Dependent Service:
    <span
      className="
        text-yellow-400
        ml-2
      "
    >
      {mostDependentService
        .service?.name ||
        "N/A"}
    </span>
  </p>

  <p>
    🚨 Last Blast Radius:
    <span
      className="
        text-red-400
        ml-2
      "
    >
      {impactedServices.length}
      {" "}
      impacted services
    </span>
  </p>
</div>


      {/* Services */}
     
<h2 className="text-3xl font-bold mb-6">
  Services
</h2>

{/* edit form */}
{editingService && (
  <div className="
    bg-slate-900
    border
    border-slate-700
    rounded-2xl
    p-6
    mb-8
  ">
    <h2 className="
      text-2xl
      font-bold
      mb-6
    ">
      Edit Service
    </h2>

    <div className="
      grid
      md:grid-cols-2
      gap-4
    ">
      <input
        value={editName}
        onChange={(e) =>
          setEditName(
            e.target.value
          )
        }
        placeholder="Service Name"
        className="
          bg-slate-800
          p-3
          rounded-lg
        "
      />

      <input
        value={editOwner}
        onChange={(e) =>
          setEditOwner(
            e.target.value
          )
        }
        placeholder="Owner"
        className="
          bg-slate-800
          p-3
          rounded-lg
        "
      />

      <input
        value={
          editDescription
        }
        onChange={(e) =>
          setEditDescription(
            e.target.value
          )
        }
        placeholder="Description"
        className="
          bg-slate-800
          p-3
          rounded-lg
        "
      />

      <select
        value={
          editCriticality
        }
        onChange={(e) =>
          setEditCriticality(
            e.target.value
          )
        }
        className="
          bg-slate-800
          p-3
          rounded-lg
        "
      >
        <option value="LOW">
          LOW
        </option>

        <option value="MEDIUM">
          MEDIUM
        </option>

        <option value="HIGH">
          HIGH
        </option>
      </select>

      <select
        value={
          editStatus
        }
        onChange={(e) =>
          setEditStatus(
            e.target.value
          )
        }
        className="
          bg-slate-800
          p-3
          rounded-lg
        "
      >
        <option value="HEALTHY">
          HEALTHY
        </option>

        <option value="DEGRADED">
          DEGRADED
        </option>

        <option value="DOWN">
          DOWN
        </option>
      </select>
    </div>

    <button
      onClick={
        updateService
      }
      className="
        mt-6
        bg-green-600
        hover:bg-green-700
        px-6
        py-3
        rounded-lg
        font-semibold
      "
    >
      Update Service
    </button>
  </div>
)}

<div className="space-y-4 mb-12">
  {filteredServices.map((service) => (
    <div
      key={service.id}
      className="
        bg-slate-900
        border
        border-slate-700
        rounded-xl
        p-4
        flex
        justify-between
        items-center
      "
    >
      {/* Left Side */}
      <div>
        <h3 className="text-lg font-semibold">
          {service.name}
        </h3>

        <p className="text-gray-400">
          Owner: {service.owner}
        </p>

        <span
          className={`
            inline-block
            mt-2
            px-4
            py-2
            rounded-full
            font-semibold
            ${
              service.status === "HEALTHY"
                ? "bg-green-600"
                : service.status === "DEGRADED"
                ? "bg-yellow-500"
                : "bg-red-600"
            }
          `}
        >
          {service.status}
        </span>
      </div>

      {/* Right Side */}
      <div className="flex gap-3">
        <button
          onClick={() => openEdit(service)}
          className="
            bg-sky-500
            hover:bg-sky-600
            px-4
            py-2
            rounded-lg
            font-semibold
          "
        >
          Edit
        </button>

        <button
          onClick={() =>
            deleteService(service.id)
          }
          className="
            bg-red-600
            hover:bg-red-700
            px-4
            py-2
            rounded-lg
            font-semibold
          "
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>

      {/* Dependencies */}
      <h2 className="
        text-3xl
        font-bold
        mb-6
      ">
        Dependencies
      </h2>

      <div className="space-y-4">
  {dependencies.map(
    (dependency) => (
      <div
        key={dependency.id}
        className="
          bg-slate-900
          border
          border-slate-700
          rounded-xl
          p-4
          flex
          justify-between
          items-center
        "
      >
        <div
          className="
            text-lg
            font-semibold
          "
        >
          {
            dependency.source
              ?.name
          }

          <span
            className="
              text-sky-400
              mx-3
            "
          >
            →
          </span>

          {
            dependency.target
              ?.name
          }
        </div>

        <button
          onClick={() =>
            deleteDependency(
              dependency.id
            )
          }
          className="
            bg-red-600
            hover:bg-red-700
            px-4
            py-2
            rounded-lg
            font-semibold
          "
        >
          Delete
        </button>
      </div>
    )
  )}
</div>   
    </div>
  );
}

export default Dashboard;