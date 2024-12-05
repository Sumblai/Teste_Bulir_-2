import React, { useState, useEffect } from "react";
import { Table, message, Spin } from "antd";
import axios from "axios";
import { ProviderHeader } from "./ProviderHeader";

interface Booking {
  _id: string;
  clientId: string;
  serviceId: string;
  providerId: string;
  reservationDate: string;
  createdAt: string;
}

export const BookingHistoryTable: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Função para buscar os dados da API
  const fetchBookings = async () => {
    try {
      // Obter o providerId do localStorage
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        message.error("Usuário não encontrado no localStorage.");
        return;
      }

      const user = JSON.parse(storedUser);
      const providerId = user._id;

      // Fazer requisição à API
      const response = await axios.get(
        `http://localhost:3000/app/bulir/BookingHistoryByProviderId/${providerId}`,
        { withCredentials: true }
      );

      if (response.status === 200 && Array.isArray(response.data.bookings)) {
        setBookings(response.data.bookings);
      } else {
        message.error("Os dados retornados não estão no formato esperado.");
      }
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
      message.error("Falha ao carregar o histórico de reservas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Configuração das colunas da tabela
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Cliente ID",
      dataIndex: "clientId",
      key: "clientId",
    },
    {
      title: "Serviço ID",
      dataIndex: "serviceId",
      key: "serviceId",
    },
    {
      title: "Data de Reserva",
      dataIndex: "reservationDate",
      key: "reservationDate",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Criado em",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <>
      <ProviderHeader />
      <div style={{ marginTop: 60, marginLeft: 120 }}>
        <p
          style={{
            fontSize: 24,
            marginLeft: 20,
            color: "#9346e2",
            fontWeight: "bold",
          }}
        >
          Historico de reservas 🔖
        </p>
      </div>
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          style={{ width: "85%", marginLeft: 120, marginTop: 40 }}
          dataSource={bookings}
          columns={columns}
          pagination={{ pageSize: 5 }}
          rowKey="_id"
          bordered
        />
      )}
    </>
  );
};

export default BookingHistoryTable;
