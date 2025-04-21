import React, { useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView, FlatList, View, Text, TextInput, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "./style";
import globalStyles from "../../global/style";
import { TransportOrderContext } from "../../context/TransportOrder/TransportOrderContext";
import Order, { TransportOrder } from "../../components/TransportOrder/TransportOrder";
import ModalFilterOrder from "../../components/FilterOrder/FilterOrder";
import BtnFilterOrder from "../../components/Buttons/FilterOrderBtn";
import Loading from "../../components/Loading/Loading";
import { numTransportOrders } from "../../constants/config";

const HomeScreen: React.FC = () => {
  const [loadingLocal, setloadingLocal] = useState<boolean>(false);
  const [allowUpload, setallowUpload] = useState<boolean>(false);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [dataList, setdataList] = useState<TransportOrder[]>([]);
  const [startPosition, setStartPosition] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>('');
  const [filteredDataList, setFilteredDataList] = useState<TransportOrder[]>([]);

  // Estados para el filtro de fechas
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
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
  } = useContext(TransportOrderContext) ?? {};

  if (!company || !orderStates || !getTransportOrders) {
    throw new Error("TransportOrderContext must be used within a TransportOrderProvider");
  }

  const fnSetdataList = useCallback((value: TransportOrder[]) => {
    setdataList(value);
    setFilteredDataList(value);
  }, []);

  const fnSetallowUpload = useCallback((value: boolean) => {
    setallowUpload(value);
  }, []);

  const fnEnableFilter = useCallback(() => {
    setOpenFilter(true);
  }, []);

  const fnSetStartPosition = useCallback((newValue: number) => {
    setStartPosition(newValue);
  }, []);

  const fnSetOpenFilter = useCallback((newValue: boolean) => {
    setOpenFilter(newValue);
  }, []);

  const fnLoadMoreItem = async () => {
    if (!allowUpload && transportOrders!.length > 0) {
      setloadingLocal(true);
      fnSetallowUpload(true);
      await getTransportOrders(orderState!, startPosition, numTransportOrders);
      setStartPosition((prevState) => prevState + numTransportOrders);
      setloadingLocal(false);
    } else {
      fnSetallowUpload(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  // 🔍 Efecto para filtrar datos por texto y fechas
  useEffect(() => {
    let filtered = dataList;

    if (searchText) {
      filtered = filtered.filter(item =>
        item.orderId.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (startDate && endDate) {
      filtered = filtered.filter(item => {
        const delivery = new Date(item.deliveryDate);
        return delivery >= startDate && delivery <= endDate;
      });
    }

    setFilteredDataList(filtered);
  }, [searchText, dataList, startDate, endDate]);

  useEffect(() => {
    const fetchData2 = async () => {
      setloading!(true);
      await getTransportOrders(orderState!, startPosition, numTransportOrders);
      setStartPosition((prevState) => prevState + numTransportOrders);
    };
    fetchData2();
  }, []);

  useEffect(() => {
    const fetchData2 = async () => {
      if (transportOrders!.length > 0) {
        const array2 = [...transportOrders!];
        const mergedArray = [...dataList, ...array2];
        const set = new Set<string>();
        const unionArray = mergedArray.filter((item) => {
          if (!set.has(item.orderId)) {
            set.add(item.orderId);
            return true;
          }
          return false;
        });
        setdataList(unionArray);
        fnSetallowUpload(false);
      } else fnSetallowUpload(false);
    };
    fetchData2();
  }, [transportOrders!.length]);

  useEffect(() => {
    const fetchData2 = async () => {
      setdataList([]);
      setloading!(true);
      await getTransportOrders(orderState!, 1, numTransportOrders);
      setallowUpload(true);
      setStartPosition(numTransportOrders + 1);
    };
    fetchData2();
  }, [company]);

  useEffect(() => {
    const fetchData2 = async () => {
      if (update) {
        setdataList([]);
        setloading!(true);
        await getTransportOrders(orderState!, 1, numTransportOrders);
        setallowUpload(true);
        setStartPosition(numTransportOrders + 1);
      }
    };
    fetchData2();
  }, [update]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View>
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

          {/* Selectores de fecha */}
          <View style={{ marginHorizontal: 8 }}>
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

            {showStartDatePicker && (
              <DateTimePicker
                value={startDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowStartDatePicker(Platform.OS === "ios");
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
                  setShowEndDatePicker(Platform.OS === "ios");
                  if (selectedDate) setEndDate(selectedDate);
                }}
              />
            )}
          </View>

          {loading ? <Loading loading={loading} /> : null}
          {loadingLocal ? <Loading loading={loadingLocal} /> : null}

          <FlatList
            data={filteredDataList}
            renderItem={({ item }) => <Order order={item} />}
            keyExtractor={(item) => item.orderId}
            ListEmptyComponent={
              <View style={globalStyles.title}>
                <Text style={[globalStyles.title, { fontSize: 20 }]}>
                  No existen registros en estado{" "}
                  {orderStates.find((x) => x.value === orderState)?.label}
                </Text>
              </View>
            }
            onEndReached={fnLoadMoreItem}
            onEndReachedThreshold={0}
            ItemSeparatorComponent={() => <View style={globalStyles.itemSeparator} />}
            maxToRenderPerBatch={2}
          />

          <ModalFilterOrder
            openFilter={openFilter}
            setOpenFilter={fnSetOpenFilter}
            setStartPosition={fnSetStartPosition}
            setallowUpload={fnSetallowUpload}
            setdataList={fnSetdataList}
          />
        </View>
      </SafeAreaView>
      <View style={globalStyles.itemSeparator} />
      <BtnFilterOrder fnEnableFilter={fnEnableFilter} />
    </>
  );
};

export default HomeScreen;
