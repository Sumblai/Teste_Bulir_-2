import React, { useEffect, useState } from "react";
import { Form, Table, message, Popconfirm, Button, Modal, Input } from "antd";
import axios from "axios";

interface ServiceType {
  key: string; // Para a tabela
  _id: string; //
  id: string; // ID único do serviço no banco
  name: string;
  description: string;
  price: string;
  availableSlots: number;
  companyname: string; // Campo para nome da empresa
}

export const ServiceList: React.FC = () => {
  const [form] = Form.useForm();
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<ServiceType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Função para buscar o `providerId` do localStorage
  const getProviderId = () => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser)._id : null;
  };

  // Atualiza o número de serviços no localStorage
  const updateServiceCount = (services: ServiceType[]) => {
    const serviceCount = services.length;
    localStorage.setItem("serviceCount", JSON.stringify(serviceCount));
  };

  // Busca serviços do backend
  const fetchServices = async () => {
    const providerId = getProviderId();
    if (!providerId) {
      message.error("Erro: Provider ID não encontrado.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/app/bulir/serviceList/${providerId}`,
        { withCredentials: true }
      );

      const data = response.data.services.map((service: ServiceType) => ({
        key: service._id,
        id: service._id,
        name: service.name,
        description: service.description,
        price: service.price,
        availableSlots: service.availableSlots,
        companyname: service.companyname,
      }));

      setServices(data);
      updateServiceCount(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Erro ao buscar serviços. Tente novamente.";
        
        console.error("Erro ao buscar serviços:", errorMessage);
        message.error(`Erro ao buscar serviços: ${errorMessage}`);
      } else {
  
        console.error("Erro ao buscar serviços:", error);
        message.error("Erro ao buscar serviços");
      }
      
    } finally {
      setLoading(false);
    }
  };

  // Deletar um serviço
  const deleteService = async (id: string) => {
    const providerId = getProviderId();
    if (!providerId) {
      message.error("Erro: Provider ID não encontrado.");
      return;
    }

    try {
      await axios.delete("http://localhost:3000/app/bulir/deleteService", {
        withCredentials: true,
        data: { serviceId: id, providerId },
      });
      message.success("Serviço deletado com sucesso!");
      fetchServices();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Erro ao apagar serviço. Tente novamente.";
        
        console.error("Erro ao apagar serviço:", errorMessage);
        message.error(`Erro so actualizar slots: ${errorMessage}`);
      } else {
  
        console.error("Erro ao apagar serviço:", error);
        message.error("Erro ao apagar serviço");
      }
    }
  };

  // Abrir modal para edição
  const openEditModal = (service: ServiceType) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  // Salvar alterações no serviço (exceto slots disponíveis)
  const saveService = async () => {
    const providerId = getProviderId();
    if (!providerId) {
      message.error("Erro: Provider ID não encontrado.");
      return;
    }

    try {
      if (editingService) {
        await axios.put(
          "http://localhost:3000/app/bulir/updateService",
          {
            serviceId: editingService.id,
            name: editingService.name,
            description: editingService.description,
            price: editingService.price,
            companyname: editingService.companyname,
            providerId,
          },
          { withCredentials: true }
        );
        message.success("Serviço atualizado com sucesso!");
        fetchServices();
        setIsModalOpen(false);
        setEditingService(null);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Erro ao actualizar serviço. Tente novamente.";
        
        console.error("Erro ao actualizar serviço:", errorMessage);
        message.error(`Erro ao actualizar serviço: ${errorMessage}`);
      } else {
  
        console.error("Erro ao actualizar serviço:", error);
        message.error("Erro ao actualizar serviço");
      }
    }
  };

  // Atualizar slots disponíveis
  const updateAvailableSlots = async () => {
    try {
      if (editingService) {
        await axios.put(
          "http://localhost:3000/app/bulir/updateSlots",
          {
            serviceId: editingService.id,
            availableSlots: editingService.availableSlots,
          },
          { withCredentials: true }
        );
        message.success("Slots atualizados com sucesso!");
        fetchServices();
        setIsModalOpen(false);
        setEditingService(null);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Erro so actualizar slots. Tente novamente.";
        
        console.error("Erro so actualizar slots:", errorMessage);
        message.error(`Erro so actualizar slots: ${errorMessage}`);
      } else {
  
        console.error("Erro so actualizar slots:", error);
        message.error("Erro so actualizar slots");
      }
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const columns = [
    {
      title: "Nome da Empresa",
      dataIndex: "companyname",
      width: "30%",
    },
    {
      title: "Nome",
      dataIndex: "name",
      width: "30%",
    },
    {
      title: "Descrição",
      dataIndex: "description",
      width: "50%",
    },
    {
      title: "Preço",
      dataIndex: "price",
      width: "20%",
    },
    {
      title: "Slots Disponíveis",
      dataIndex: "availableSlots",
      width: "20%",
    },
    {
      title: "Operações",
      dataIndex: "operation",
      render: (_: unknown, record: ServiceType) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button type="link" onClick={() => openEditModal(record)}>
            Editar
          </Button>
          <Popconfirm
            title="Tem certeza que deseja deletar?"
            onConfirm={() => deleteService(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button type="link" danger>
              Deletar
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Modal de edição */}
      <Modal
        title="Editar Serviço"
        visible={isModalOpen}
        onOk={saveService}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingService(null);
        }}
        okText="Salvar"
        cancelText="Cancelar"
      >
        <Form layout="vertical">
          <Form.Item label="Nome da Empresa">
            <Input
              value={editingService?.companyname}
              onChange={(e) =>
                setEditingService({
                  ...editingService!,
                  companyname: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item label="Nome">
            <Input
              value={editingService?.name}
              onChange={(e) =>
                setEditingService({
                  ...editingService!,
                  name: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item label="Descrição">
            <Input
              value={editingService?.description}
              onChange={(e) =>
                setEditingService({
                  ...editingService!,
                  description: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item label="Preço">
            <Input
              value={editingService?.price}
              onChange={(e) =>
                setEditingService({
                  ...editingService!,
                  price: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item label="Slots Disponíveis">
            <Input
              type="number"
              value={editingService?.availableSlots}
              onChange={(e) =>
                setEditingService({
                  ...editingService!,
                  availableSlots: Number(e.target.value),
                })
              }
            />
          </Form.Item>
        </Form>
        <Button onClick={updateAvailableSlots} type="primary">
          Atualizar Slots
        </Button>
      </Modal>

      {/* Tabela de serviços */}
      <Form form={form} component={false}>
        <Table
          dataSource={services}
          columns={columns}
          bordered
          rowKey="key"
          loading={loading}
        />
      </Form>
    </>
  );
};

export default ServiceList;
