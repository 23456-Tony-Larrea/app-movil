import React, { useCallback, useContext, useEffect, useState } from "react";
import styles from "./style";
import globalStyles from "../../global/style";
import { SafeAreaView, FlatList, View, Text } from "react-native";
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
  const [startPosition, setStartPosition] = useState(1);
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
  }, []);
  const fnSetallowUpload = useCallback((value) => {
    setallowUpload(value);
  }, []);
  const fnEnableFilter = useCallback(() => {
    setOpenFilter(true);
  }, []);
  const fnSetStartPosition = useCallback((newValue) => {
    setStartPosition(newValue);
  }, []);
  const fnSetOpenFilter = useCallback((newValue) => {
    setOpenFilter(newValue);
  }, []);
  const fnLoadMoreItem = async () => {
    if (!allowUpload && transportOrders.length > 0) {
      setloadingLocal(true);
      fnSetallowUpload(true);
      await getTransportOrders(orderState, startPosition, numTransportOrders);
      setStartPosition((prevState) => prevState + numTransportOrders);
      setloadingLocal(false);
    } else {
      fnSetallowUpload(false);
    }
  };

  useEffect(() => {
    const fetchData2 = async () => {
      setloading(true);
      await getTransportOrders(orderState, startPosition, numTransportOrders);
      setStartPosition((prevState) => prevState + numTransportOrders);
    };
    fetchData2();
  }, []);
  useEffect(() => {
    const fetchData2 = async () => {
      if (transportOrders.length > 0) {
        const array2 = [...transportOrders];
        const mergedArray = [...dataList, ...array2];
        let set = new Set();
        let unionArray = mergedArray.filter((item) => {
          if (!set.has(item.orderId)) {
            set.add(item.orderId);
            return true;
          }
          return false;
        }, set);
        setdataList(unionArray);
        fnSetallowUpload(false);
      } else fnSetallowUpload(false);
    };
    fetchData2();
  }, [transportOrders.length]);
  useEffect(() => {
    const fetchData2 = async () => {
      setdataList([]);
      setloading(true);
      await getTransportOrders(orderState, 1, numTransportOrders);
      setallowUpload(true);
      setStartPosition(numTransportOrders + 1);
    };
    fetchData2();
  }, [company]);

  useEffect(() => {
    const fetchData2 = async () => {
      if (update) {
        setdataList([]);
        setloading(true);
        await getTransportOrders(orderState, 1, numTransportOrders);
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
          {loading ? <Loading loading={loading} /> : null}
          {loadingLocal ? <Loading loading={loadingLocal} /> : null}
          <FlatList
            data={dataList}
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
            onEndReached={fnLoadMoreItem}
            onEndReachedThreshold={0}
            ItemSeparatorComponent={<View style={globalStyles.itemSeparator} />}
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
