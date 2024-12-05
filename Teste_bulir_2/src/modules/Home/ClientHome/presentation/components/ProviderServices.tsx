import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, DatePicker, message, Spin } from "antd"; // Importando Modal e DatePicker do Ant Design
import moment from "moment";
import { useMediaQuery } from "react-responsive";

interface Service {
  _id: string;
  companyname: string;
  name: string;
  description: string;
  price: number;
  availableSlots: number;
  providerId: string;
}

export default function ProviderServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [reservationDate, setReservationDate] = useState<string>(""); // A data selecionada
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Controle do modal
  const [selectedServiceId, setSelectedServiceId] = useState<string>(""); // ID do serviço selecionado
  const IsIphone14ProMax = useMediaQuery({ maxWidth: 430 });

  // Recupera o `clientId` do `localStorage`
  const getClientId = () => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser)._id : null;
  };

  // Função para buscar serviços
  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/app/bulir/getAllServices",
        {
          withCredentials: true,
        }
      );
      setServices(response.data.services); // Supondo que a resposta tenha a chave 'services'
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleReserveClick = (serviceId: string) => {
    setSelectedServiceId(serviceId); // Armazenando o ID do serviço selecionado
    setIsModalVisible(true); // Exibindo o modal
  };

  const handleOk = async () => {
    const clientId = getClientId();
    if (!clientId) {
      message.error("Erro: Não foi possível identificar o usuário.");
      return;
    }

    if (!reservationDate) {
      message.error("Por favor, selecione uma data de reserva.");
      return;
    }

    try {
      const bookingData = {
        clientId,
        serviceId: selectedServiceId,
        reservationDate: reservationDate,
      };

      const response = await axios.post(
        "http://localhost:3000/app/bulir/booking",
        bookingData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        const updatedBalance = response.data.balance; // Captura o novo balance da resposta

        // Atualizar o balance no localStorage
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          const user = JSON.parse(storedUser); // Converte o JSON para objeto
          user.balance = updatedBalance; // Atualiza o balance
          localStorage.setItem("user", JSON.stringify(user)); // Salva o objeto atualizado no localStorage
        }
        message.success("Reserva realizada com sucesso!");
        setReservationDate("");
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error("Erro ao realizar a reserva:", error);
      message.error("Falha ao realizar a reserva.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: "20px", width: "100%" }}>
      <div style={{ display: "flex" }} className="SearchContainer">
        <input
          style={{
            width: "80%",
            padding: "15px 10px",
            paddingLeft: 15,
            height: 40,
            marginTop: 50,
            borderRadius: 7,
            border: "5px solid #9346e2",
            outline: "none",
            fontSize: 16,
            marginLeft: IsIphone14ProMax ? 0 : 120,
          }}
          type="text"
          placeholder="Digite o serviço que procura"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {filteredServices.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: 50 }}>
              <p>Nenhum serviço encontrado.</p>
            </div>
          ) : (
            filteredServices.map((service) => (
              <div
                className="ServicesArea"
                key={service._id}
                style={{
                  width: IsIphone14ProMax ? 370 : 1000,
                  marginTop: 50,
                  marginLeft: IsIphone14ProMax ? 5 : 120,
                  borderTop: "1px solid #ccc",
                  paddingTop: 20,
                  paddingBottom: 20,
                }}
              >
                <div
                  className="ServiceInformation"
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  <p className="ServiceName" style={{ fontSize: 22 }}>
                    {service.name}
                  </p>
                  <p className="CompanyName">Empresa : {service.companyname}</p>
                  <p className="ServiceDescription" style={{ color: "#ccc" }}>
                    {service.description}
                  </p>
                  <p>Preço: {service.price} KZ</p>
                  <p style={{ fontWeight: "bold" }}>
                    Status:{" "}
                    <span
                      style={{
                        color: service.availableSlots === 0 ? "red" : "green",
                      }}
                    >
                      {service.availableSlots === 0
                        ? "Indisponível"
                        : "Disponível"}
                    </span>
                  </p>
                </div>

                <div className="ServiceActions" style={{ marginTop: 20 }}>
                  <input
                    style={{
                      padding: "10px 30px",
                      borderRadius: 5,
                      border: "none",
                      backgroundColor:
                        service.availableSlots === 0 ? "#ccc" : "#9346e2",
                      color: service.availableSlots === 0 ? "#666" : "#fff",
                      fontWeight: "bold",
                      cursor:
                        service.availableSlots === 0
                          ? "not-allowed"
                          : "pointer",
                    }}
                    type="button"
                    value="Reservar"
                    onClick={() => handleReserveClick(service._id)} // Passando o ID do serviço
                    disabled={service.availableSlots === 0} // Desabilita o botão se os slots forem 0
                  />
                </div>
              </div>
            ))
          )}
        </>
      )}

      {/* Modal para confirmar a reserva */}
      <Modal
        title="Confirmar Reserva"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancelar
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleOk}
          >
            Confirmar
          </Button>,
        ]}
      >
        <p>Selecione a data para a reserva:</p>
        <DatePicker
          style={{ width: "100%" }}
          onChange={(dateString) => {
            if (typeof dateString === "string") {
              setReservationDate(dateString);
            }
          }}
          value={reservationDate ? moment(reservationDate) : null}
          format="YYYY-MM-DD"
        />
      </Modal>
    </div>
  );
}
