import  { useState, useEffect, useCallback } from "react";
import {
  Table,
  message,
  Spin,
  Button,
  Modal,
  DatePicker,
  Popconfirm,
} from "antd";
import axios from "axios";
import { HomeHeader } from "./HomeHeader";
import { useMediaQuery } from "react-responsive";
import moment from "moment";


interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
}

interface Booking {
  _id: string;
  serviceId: Service;
  clientId: string;
  providerId: string;
  reservationDate: string;
  createdAt: string;
}

export default function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [newReservationDate, setNewReservationDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const IsIphone14ProMax = useMediaQuery({ maxWidth: 430 });
  // Função para buscar o `clientId` do localStorage
  const getClientId = useCallback((): string | null => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser)._id : null;
  }, []);

  // Função para buscar as reservas
  const fetchBookings = useCallback(async () => {
    const clientId = getClientId();
    if (!clientId) {
      message.error("Erro: Client ID não encontrado.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://teste-para-a-a-vaga-de-desenvolvedor.onrender.com/app/bulir/clientHistory/${clientId}`,
        { withCredentials: true }
      );

      console.log("Dados recebidos da API:", response.data);

      if (response.status === 200 && Array.isArray(response.data.bookings)) {
        const formattedData = response.data.bookings.map((item: Booking) => ({
          key: item._id,
          ...item,
        }));
        setBookings(formattedData);
      } else {
        message.error("Os dados retornados não estão no formato esperado.");
        setBookings([]);
      }
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
      message.error("Erro ao buscar os dados.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [getClientId]);

  // Chama fetchBookings ao carregar o componente
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]); // A dependência é o fetchBookings

  // Função para apagar o booking
  const deleteBooking = async (bookingId: string) => {
    const clientId = getClientId();
    if (!clientId) {
      message.error("Erro: Client ID não encontrado.");
      return;
    }

    try {
      await axios.delete(
        `https://teste-para-a-a-vaga-de-desenvolvedor.onrender.com/app/bulir/booking/${bookingId}`,
        {
          data: { clientId }, // Envia o ID do cliente no corpo
          withCredentials: true,
        }
      );
      message.success("Reserva apagada com sucesso!");
      fetchBookings(); // Atualiza a tabela após apagar
    } catch (error) {
      console.error("Erro ao apagar reserva:", error);
      message.error("Erro ao apagar a reserva.");
    }
  };

  // Função para atualizar a data da reserva
  const updateBookingDate = async () => {
    if (!selectedBookingId || !newReservationDate) {
      message.error("Por favor, selecione uma data válida.");
      return;
    }

    try {
      await axios.put(
        `https://teste-para-a-a-vaga-de-desenvolvedor.onrender.com/app/bulir/booking/${selectedBookingId}/update-date`,
        { newReservationDate },
        { withCredentials: true }
      );
      message.success("Data da reserva atualizada com sucesso!");
      fetchBookings();
      setIsModalOpen(false);
      setSelectedBookingId(null);
      setNewReservationDate(null);
    } catch (error) {
      console.error("Erro ao atualizar a data da reserva:", error);
      message.error("Erro ao atualizar a data da reserva.");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id", // Remover o dataIndex duplicado
      width: "20%",
    },
    {
      title: "Nome",
      dataIndex: "serviceId.name",
      key: "name",
      width: "20%",
      render: (_: string, record: Booking) => record.serviceId?.name || "N/A",
    },
    {
      title: "Descrição",
      dataIndex: "serviceId.description",
      key: "description",
      width: "30%",
      render: (_: string, record: Booking) =>
        record.serviceId?.description || "N/A",
    },
    {
      title: "Preço",
      dataIndex: "serviceId.price",
      key: "price",
      width: "10%",
      render: (_: string, record: Booking) =>
        record.serviceId?.price !== undefined
          ? `Kz ${record.serviceId.price}`
          : "Kz 0",
    },
    {
      title: "Data da Reserva",
      dataIndex: "reservationDate",
      key: "reservationDate",
      width: "20%",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString() : "N/A",
    },
    {
      title: "Ações",
      key: "actions",
      width: "20%",
      render: (_: string, record: Booking) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            type="primary"
            onClick={() => {
              setSelectedBookingId(record._id); // Define o ID do booking
              setIsModalOpen(true); // Abre o modal para atualizar a data
            }}
          >
            Atualizar Data
          </Button>
          <Popconfirm
            title="Tem certeza que deseja apagar esta reserva?"
            onConfirm={() => deleteBooking(record._id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button type="primary" danger>
              Apagar
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <HomeHeader />
      <div style={{ marginTop: 60, marginLeft: IsIphone14ProMax ? 0 : 120 }}>
        <p style={{ fontSize: 24, marginLeft: 20, color: "#9346e2", fontWeight: "bold" }}>
          Reservas 🔖
        </p>
      </div>
      <div style={{ padding: "20px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            style={{
              width: "85%",
              marginLeft: IsIphone14ProMax ? 0 : 120,
              marginTop: 40,
            }}
            dataSource={bookings}
            columns={columns}
            pagination={{ pageSize: 10 }}
            bordered
            rowKey="key"
          />
        )}

        {/* Modal para atualizar a data */}
        <Modal
          title="Atualizar Data da Reserva"
          visible={isModalOpen}
          onOk={updateBookingDate}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedBookingId(null);
            setNewReservationDate(null);
          }}
          okText="Atualizar"
          cancelText="Cancelar"
        >
    <DatePicker
      showTime
      format="YYYY-MM-DD HH:mm:ss"
      onChange={(dateString) => {
        if (typeof dateString === "string") {
          setNewReservationDate(dateString);
        } else {
          setNewReservationDate(null);
        }
      }}
      placeholder="Selecione uma nova data"
      value={newReservationDate ? moment(newReservationDate) : null} // Usando o moment corretamente
    />

        </Modal>
      </div>
    </>
  );
}
