import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";

interface ServiceFormProps {
  onAddService: (service: {
    companyname: string;
    name: string;
    description: string;
    price: string;
  }) => void;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({ onAddService }) => {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleFocus = (name: string) => {
    setFocusedInput(name);
  };

  const getBackgroundColor = (name: string) => {
    return focusedInput === name ? "#fff" : "#ccc";
  };

  const [serviceData, setServiceData] = useState({
    companyname: "",
    name: "",
    description: "",
    price: "",
    providerId: "",
  });

  // Função para buscar o providerId do localStorage
  const loadProviderId = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const providerId = JSON.parse(storedUser)._id;
      setServiceData((prevState) => ({ ...prevState, providerId }));
    }
  };

  useEffect(() => {
    loadProviderId();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setServiceData({ ...serviceData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/app/bulir/service",
        serviceData,
        { withCredentials: true }
      );

      alert("Serviço criado com sucesso!");
      console.log("Resposta:", response.data);

      // Adiciona o novo serviço à tabela
      onAddService({
        companyname: serviceData.companyname,
        name: serviceData.name,
        description: serviceData.description,
        price: serviceData.price,
      });

      // Limpar o formulário
      setServiceData({
        companyname: "",
        name: "",
        description: "",
        price: "",
        providerId: serviceData.providerId, // Mantém o providerId
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Erro ao criar serviço. Tente novamente.";
        
        console.error("Erro ao criar serviço:", errorMessage);
        message.error(`Erro so actualizar slots: ${errorMessage}`);
      } else {
  
        console.error("Erro ao criar serviço:", error);
        message.error("Erro ao criar serviço");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="text"
        name="companyname"
        placeholder="Nome da empresa"
        value={serviceData.companyname}
        onChange={handleChange}
        onFocus={() => handleFocus("companyname")}
        onBlur={() => setFocusedInput(null)}
        style={{
          marginRight: "10px",
          padding: "15px 10px",
          borderRadius: 7,
          border: "none",
          outlineColor: "#9346e2",
          backgroundColor: getBackgroundColor("companyname"),
        }}
      />
      <input
        type="text"
        name="name"
        placeholder="Nome do serviço"
        value={serviceData.name}
        onChange={handleChange}
        onFocus={() => handleFocus("name")}
        onBlur={() => setFocusedInput(null)}
        style={{
          marginRight: "10px",
          padding: "15px 10px",
          borderRadius: 7,
          border: "none",
          outlineColor: "#9346e2",
          backgroundColor: getBackgroundColor("name"),
        }}
      />
      <input
        type="text"
        name="description"
        placeholder="Descrição"
        value={serviceData.description}
        onChange={handleChange}
        onFocus={() => handleFocus("description")}
        onBlur={() => setFocusedInput(null)}
        style={{
          marginRight: "10px",
          padding: "15px 10px",
          borderRadius: 7,
          border: "none",
          outlineColor: "#9346e2",
          backgroundColor: getBackgroundColor("description"),
        }}
      />
      <input
        type="number"
        name="price"
        placeholder="Preço"
        value={serviceData.price}
        onChange={handleChange}
        onFocus={() => handleFocus("price")}
        onBlur={() => setFocusedInput(null)}
        style={{
          marginRight: "10px",
          padding: "15px 10px",
          borderRadius: 7,
          border: "none",
          outlineColor: "#9346e2",
          backgroundColor: getBackgroundColor("price"),
        }}
      />
      <button
        style={{
          padding: "15px 30px",
          borderRadius: 7,
          border: "none",
          color: "#fff",
          backgroundColor: "#9346e2",
          fontSize: 17,
          fontWeight: 500,
        }}
        type="submit"
      >
        Criar Serviço
      </button>
    </form>
  );
};

export default ServiceForm;
