import React, { useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView, FlatList, View, Text, TextInput, Button } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "./style";
import globalStyles from "../../global/style";
import { TransportOrderContext } from "../../context/TransportOrder/TransportOrderContext";
import Order from "../../components/TransportOrder/TransportOrder";
import ModalFilterOrder from "../../components/FilterOrder/FilterOrder";
import BtnFilterOrder from "../../components/Buttons/FilterOrderBtn";
import Loading from "../../components/Loading/Loading";
import { numTransportOrders } from "../../constants/config";

const HomeScreen = () => {
  const [loadingLocal, setloadingLocal] = useState(false);
  const [allowUpload, setallowUpload] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [dataList, setdataList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startPosition, setStartPosition] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const {
    company,
    update,
    orderStates,
    transportOrders,
    loading,
    orderState,
    setloading,
    getTransportOrders,
  } = useContext(TransportOrderContext);

  const fnSetdataList = useCallback((value) => {
    setdataList(value);
    setFilteredData(value);
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = dataList.filter((item) =>
      item.orderId.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const filterByDate = () => {
    if (startDate && endDate) {
      const filtered = dataList.filter((item) => {
        const orderDate = new Date(item.date); // Asegúrate de que `item.date` sea el campo correcto
        return orderDate >= startDate && orderDate <= endDate;
      });
      setFilteredData(filtered);
    }
  };

  useEffect(() => {
    setFilteredData(dataList);
  }, [dataList]);

  useEffect(() => {
    const fetchData2 = async () => {
      setloading(true);
      await getTransportOrders(orderState, startPosition, numTransportOrders);
      setStartPosition((prevState) => prevState + numTransportOrders);
    };
    fetchData2();
  }, []);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View>
          {loading ? <Loading loading={loading} /> : null}
          {loadingLocal ? <Loading loading={loadingLocal} /> : null}

          {/* Filtro por Order ID */}
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 8,
              margin: 8,
            }}
            placeholder="Buscar por Order ID..."
            value={searchText}
            onChangeText={handleSearch}
          />

          {/* Filtro por rango de fechas */}
          <Text
            onPress={() => setShowStartDatePicker(true)}
            style={{ padding: 10, backgroundColor: "#eee", borderRadius: 5, marginBottom: 5 }}
          >
            {startDate ? `Desde: ${startDate.toLocaleDateString()}` : "Seleccionar fecha de inicio"}
          </Text>
          <Text
            onPress={() => setShowEndDatePicker(true)}
            style={{ padding: 10, backgroundColor: "#eee", borderRadius: 5 }}
          >
            {endDate ? `Hasta: ${endDate.toLocaleDateString()}` : "Seleccionar fecha final"}
          </Text>
          <Button title="Aplicar filtro de fechas" onPress={filterByDate} />

          {showStartDatePicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartDatePicker(false);
                if (selectedDate) setStartDate(selectedDate);
              }}
            />
          )}
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowEndDatePicker(false);
                if (selectedDate) setEndDate(selectedDate);
              }}
            />
          )}

          <FlatList
            data={filteredData}
            renderItem={({ item }) => <Order order={item} />}
            keyExtractor={(item) => item.orderId}
            ListEmptyComponent={
              <View style={globalStyles.title}>
                <Text style={[globalStyles.title, { fontSize: 20 }]}>
                  No existen registros en estado
                  {" " +
                    orderStates.filter((x) => x.value === orderState)[0].label}
                </Text>
              </View>
            }
            onEndReachedThreshold={0}
            ItemSeparatorComponent={<View style={globalStyles.itemSeparator} />}
            maxToRenderPerBatch={2}
          />
          <ModalFilterOrder
            openFilter={openFilter}
            setOpenFilter={setOpenFilter}
            setStartPosition={setStartPosition}
            setallowUpload={setallowUpload}
            setdataList={fnSetdataList}
          />
        </View>
      </SafeAreaView>
      <View style={globalStyles.itemSeparator} />
      <BtnFilterOrder fnEnableFilter={() => setOpenFilter(true)} />
    </>
  );
};

export default HomeScreen;