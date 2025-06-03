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
import Icon from "react-native-vector-icons/MaterialIcons";
import { redStrong, redLife } from "../../constants/color";

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
    const filtered = dataList.filter((item) => {
      const orderDate = new Date(item.date);
      // Normaliza las fechas a solo día para evitar problemas de hora
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999);
      orderDate.setHours(12,0,0,0); // para evitar desfases por zona horaria
      return orderDate >= start && orderDate <= end;
    });
    setFilteredData(filtered);
  };

  const handleSortByDate = () => {
    setSortDesc((prev) => !prev);
    const sorted = [...filteredData].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortDesc ? dateB - dateA : dateA - dateB;
    });
    setFilteredData(sorted);
  };

  useEffect(() => {
    // Simular datos mock en estado 'verificado' ("2") para pruebas
    const mockOrders = [
      {
        orderId: "ORD001",
        codigoOT: "OT-1001",
        secuencial: 1,
        date: "2024-06-01T10:00:00Z",
        status: "2",
        deliveryDate: "2024-06-05T15:00:00Z",
        customer: "Cliente A",
        description: "Entrega de productos A",
        orderLines: [
          { salesOrderId: "SO-001-A" },
          { salesOrderId: "SO-001-B" }
        ]
      },
      {
        orderId: "ORD002",
        codigoOT: "OT-1002",
        secuencial: 2,
        date: "2024-06-02T11:00:00Z",
        status: "2",
        deliveryDate: "2024-06-06T16:00:00Z",
        customer: "Cliente B",
        description: "Entrega de productos B",
        orderLines: [
          { salesOrderId: "SO-002-A" }
        ]
      },
      {
        orderId: "ORD003",
        codigoOT: "OT-1003",
        secuencial: 3,
        date: "2024-06-03T12:00:00Z",
        status: "2",
        deliveryDate: "2024-06-07T17:00:00Z",
        customer: "Cliente C",
        description: "Entrega de productos C",
        orderLines: [
          { salesOrderId: "SO-003-A" },
          { salesOrderId: "SO-003-B" },
          { salesOrderId: "SO-003-C" }
        ]
      },
      {
        orderId: "ORD004",
        codigoOT: "OT-1004",
        secuencial: 4,
        date: "2024-06-04T13:00:00Z",
        status: "2",
        deliveryDate: "2024-06-08T18:00:00Z",
        customer: "Cliente D",
        description: "Entrega de productos D",
        orderLines: [
          { salesOrderId: "SO-004-A" }
        ]
      },
      {
        orderId: "ORD005",
        codigoOT: "OT-1005",
        secuencial: 5,
        date: "2024-06-05T14:00:00Z",
        status: "2",
        deliveryDate: "2024-06-09T19:00:00Z",
        customer: "Cliente E",
        description: "Entrega de productos E",
        orderLines: [
          { salesOrderId: "SO-005-A" },
          { salesOrderId: "SO-005-B" }
        ]
      },
    ];
    setdataList(mockOrders);
    setFilteredData(mockOrders);
  }, []);

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

  // Utilidad para formatear Date a 'YYYY-MM-DD'
  function formatDateToString(date) {
    if (!date) return '';
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();
    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }

  return (
    <>
      <SafeAreaView style={[styles.container, { backgroundColor: "#fff", flex: 1 }]}> 
        <FlatList
          ListHeaderComponent={
            <View>
              {/* Filtros y buscador */}
              <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 10, borderWidth: 1, borderColor: redStrong, marginBottom: 12, paddingHorizontal: 8, shadowColor: redStrong, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}>
                <Icon name="search" size={24} color={redStrong} style={{ marginRight: 8 }} />
                <TextInput
                  style={{ flex: 1, fontSize: 16, color: redStrong, backgroundColor: "#fff", paddingVertical: 8, borderRadius: 10 }}
                  placeholder="Buscar por Order ID o Orden de Venta..."
                  placeholderTextColor={redLife}
                  value={searchText}
                  onChangeText={handleSearch}
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