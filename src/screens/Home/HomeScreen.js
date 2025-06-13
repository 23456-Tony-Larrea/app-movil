import React, { useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView, FlatList, View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "./style";
import globalStyles from "../../global/style";
import { TransportOrderContext } from "../../context/TransportOrder/TransportOrderContext";
import Order from "../../components/TransportOrder/TransportOrder";
import ModalFilterOrder from "../../components/FilterOrder/FilterOrder";
import BtnFilterOrder from "../../components/Buttons/FilterOrderBtn";
import Loading from "../../components/Loading/Loading";
import { numTransportOrders } from "../../constants/config";
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { redStrong, redLife } from "../../constants/color";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  // Nuevo filtro para ordenar por fecha más actual a más baja
  const [sortDesc, setSortDesc] = useState(true);
  const [orderLines, setOrderLines] = useState([]);

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
      item.orderId.toLowerCase().includes(text.toLowerCase()) ||
      (item.codigoOT && item.codigoOT.toLowerCase().includes(text.toLowerCase()))
    );
    setFilteredData(filtered);
  };

  const filterByDate = () => {
    if (!startDate || !endDate) {
      setFilteredData([]);
      return;
    }
    // Formatea las fechas a 'YYYY-MM-DD'
    const formatDate = (date) => {
      if (!date) return null;
      const d = new Date(date);
      if (isNaN(d.getTime())) return null;
      const month = '' + (d.getMonth() + 1);
      const day = '' + d.getDate();
      const year = d.getFullYear();
      return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
    };
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    const filtered = dataList.filter((item) => {
      // Filtra por fecha de entrega (deliveryDate) en vez de date
      const itemDate = formatDate(item.deliveryDate);
      if (!itemDate) return false;
      return itemDate >= start && itemDate <= end;
    });
    setFilteredData(filtered);
  };

  const handleSortByDate = () => {
    setSortDesc((prev) => !prev);
    const sorted = [...filteredData].sort((a, b) => {
      const dateA = new Date(a.deliveryDate);
      const dateB = new Date(b.deliveryDate);
      // sortDesc true: más reciente a más antigua, false: más antigua a más reciente
      return sortDesc ? dateB - dateA : dateA - dateB;
    });
    setFilteredData(sorted);
  };

  // Función para limpiar todos los filtros
  const clearFilters = () => {
    setSearchText("");
    setStartDate(null);
    setEndDate(null);
    setFilteredData(dataList);
  };

  // Eliminar datos mock y usar datos del backend
  useEffect(() => {
    const fetchData = async () => {
      setloading(true);
      await getTransportOrders(orderState, startPosition, numTransportOrders);
      setStartPosition((prevState) => prevState + numTransportOrders);
      setloading(false);
    };
    fetchData();
  }, []);

  // Actualizar dataList cuando cambian los datos del backend
  useEffect(() => {
    setdataList(transportOrders || []);
    setFilteredData(transportOrders || []);
  }, [transportOrders]);

  useEffect(() => {
    setFilteredData(dataList);
  }, [dataList]);

  // Utilidad para formatear Date a 'YYYY-MM-DD'
  function formatDateToString(date) {
    if (!date) return '';
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();
    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }

  useEffect(() => {
    // Cargar las últimas líneas de orden guardadas (si existen)
    const loadOrderLines = async () => {
      const lastOrderLines = await AsyncStorage.getItem('lastOrderLines');
      if (lastOrderLines) {
        setOrderLines(JSON.parse(lastOrderLines));
      }
    };
    loadOrderLines();
  }, []);

  return (
    <>
      <SafeAreaView style={[styles.container, { backgroundColor: "#fff", flex: 1 }]}> 
        {/* Loading */}
        {loading && (
          <View style={{ marginVertical: 12 }}>
            <Loading loading={loading} />
          </View>
        )}
        <FlatList
          ListHeaderComponent={
            <View>
              {/* Filtros y buscador */}
              <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 10, borderWidth: 1, borderColor: redStrong, marginBottom: 12, paddingHorizontal: 8, shadowColor: redStrong, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}>
                <Icon name="search" size={24} color={redStrong} style={{ marginRight: 8 }} />
                <TextInput
                  style={{ flex: 1, fontSize: 16, color: redStrong, backgroundColor: "#fff", paddingVertical: 8, borderRadius: 10 }}
                  placeholder="Buscar por Order ID..."
                  placeholderTextColor={redLife}
                  value={searchText}
                  onChangeText={(text) => {
                    setSearchText(text);
                    const filtered = dataList.filter((item) =>
                      item.orderId && item.orderId.toLowerCase().includes(text.toLowerCase())
                    );
                    setFilteredData(filtered);
                  }}
                />
                <TouchableOpacity onPress={handleSortByDate} style={{ marginLeft: 8, padding: 4 }}>
                  <Icon name={sortDesc ? "arrow-downward" : "arrow-upward"} size={24} color={redStrong} />
                </TouchableOpacity>
              
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                <Text
                  onPress={() => setShowStartDatePicker(true)}
                  style={{ flex: 1, textAlign: "center", padding: 12, backgroundColor: redLife, color: "#fff", borderRadius: 8, marginRight: 6, fontWeight: "bold", fontSize: 15, borderWidth: 1, borderColor: redStrong }}
                >
                  {startDate ? `Desde: ${startDate.toLocaleDateString()}` : "Seleccionar fecha de inicio"}
                </Text>
                <Text
                  onPress={() => setShowEndDatePicker(true)}
                  style={{ flex: 1, textAlign: "center", padding: 12, backgroundColor: redLife, color: "#fff", borderRadius: 8, marginLeft: 6, fontWeight: "bold", fontSize: 15, borderWidth: 1, borderColor: redStrong }}
                >
                  {endDate ? `Hasta: ${endDate.toLocaleDateString()}` : "Seleccionar fecha final"}
                </Text>
                <TouchableOpacity onPress={clearFilters} style={{ marginLeft: 8, padding: 4, backgroundColor: redStrong, borderRadius: 8, justifyContent: 'center', alignItems: 'center', height: 48, width: 48 }}>
                  <Icon name="clear" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              <Button title="Aplicar filtro de fechas" color={redStrong} onPress={filterByDate} />
              {/* DateTimePickers */}
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
            </View>
          }
          data={filteredData}
          renderItem={({ item }) => (
            <View style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              borderWidth: 2,
              borderColor: redStrong,
              marginBottom: 10,
              padding: 0,
              shadowColor: redStrong,
              shadowOpacity: 0.08,
              shadowRadius: 6,
              elevation: 2,
              overflow: "hidden"
            }}>
              <Order order={item} />
            </View>
          )}
          keyExtractor={(item) => item.orderId}
          ListEmptyComponent={
            <View style={[globalStyles.title, { backgroundColor: "#fff", borderRadius: 10, padding: 24, marginTop: 30, borderWidth: 1, borderColor: redStrong }]}> 
              <Icon name="info-outline" size={32} color={redStrong} style={{ alignSelf: "center", marginBottom: 8 }} />
              <Text style={[globalStyles.title, { fontSize: 20, color: redStrong, textAlign: "center" }]}> 
                {(!startDate || !endDate)
                  ? "Selecciona fecha desde y hasta para filtrar"
                  : "No existen registros con esas fechas"}
              </Text>
            </View>
          }
          onEndReachedThreshold={0}
          ItemSeparatorComponent={<View style={{ height: 12 }} />}
          maxToRenderPerBatch={2}
          style={{ marginTop: 16 }}
          contentContainerStyle={{ paddingBottom: 32 }}
        />
        <ModalFilterOrder
          openFilter={openFilter}
          setOpenFilter={setOpenFilter}
          setStartPosition={setStartPosition}
          setallowUpload={setallowUpload}
          setdataList={fnSetdataList}
        />
      </SafeAreaView>
      <View style={{ height: 16, backgroundColor: "#fff" }} />
      <BtnFilterOrder fnEnableFilter={() => setOpenFilter(true)} />
    </>
  );
};

export default HomeScreen;