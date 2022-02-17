import { useEffect, useState } from "react";

import Header from "../../components/Header";
import api from "../../services/api";
import Food, { IFood } from "../../components/Food";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<IFood>({
    id: -1,
    available: true,
    name: "",
    description: "",
    image: "",
    price: "",
  });
  const [foods, setFoods] = useState<IFood[]>([]);

  useEffect(() => {
    api.get("/foods").then((response) => {
      setFoods(response.data);
    });
  }, []);

  const handleAddFood = async (food: IFood) => {
    try {
      return api
        .post("/foods", {
          ...food,
          available: true,
        })
        .then((response) => {
          setFoods([...foods, response.data]);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateFood = async (food: IFood) => {
    try {
      return api
        .put(`/foods/${editingFood.id}`, {
          ...editingFood,
          ...food,
        })
        .then((response) => {
          const foodsUpdated = foods.map((food) =>
            food.id !== response.data.id ? food : response.data
          );
          setFoods(foodsUpdated);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFood = async (id: number) => {
    return api.delete(`/foods/${id}`).then((response) => {
      const foodsFiltered = foods.filter((food: IFood) => food.id !== id);
      setFoods(foodsFiltered);
    });
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const handleEditFood = (food: IFood) => {
    setEditingFood(food);
    setEditModalOpen(true);
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
