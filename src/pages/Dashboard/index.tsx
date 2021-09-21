import { useCallback, useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import FoodItem from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { Food } from '../../types'

const Dashboard = () => {
  const [foods, setFoods] = useState<Food[]>([])
  const [editingFood, setEditingFood] = useState<Food>()
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)

  const requestFoods = useCallback(async () => {
    const response = await api.get('/foods');

    setFoods(response.data)
  }, [])

  useEffect(() => {
    requestFoods()
  }, [requestFoods])


  const handleAddFood = useCallback(async food => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err);
    }
  }, [foods])


  const handleUpdateFood = useCallback(async food => {
    try {
      if (!editingFood) {
        return
      }
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err);
    }
  }, [editingFood, foods])


  const handleDeleteFood = useCallback(async id => {

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered)
  }, [foods])

  const toggleModal = useCallback(() => {
    setModalOpen(!modalOpen)
  }, [modalOpen])

  const toggleEditModal = useCallback(() => {
    setEditModalOpen(!editModalOpen)
  }, [editModalOpen])

  const handleEditFood = useCallback( food => {
    setEditingFood(food)
    setEditModalOpen(true)
  }, [])


  return  (
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
          foods.map(food => (
            <FoodItem
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

export default Dashboard;
