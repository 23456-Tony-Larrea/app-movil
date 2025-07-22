import React, { useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView, FlatList, View, Text, TextInput, TouchableOpacity } from "react-native";
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
  // Estado para controlar qué órdenes tienen OV expandidas
  const [expandedOrders, setExpandedOrders] = useState({});
  // Estado para búsqueda avanzada
  const [advancedSearchLoaded, setAdvancedSearchLoaded] = useState(false);
  const [loadingAdvancedSearch, setLoadingAdvancedSearch] = useState(false);

  const {
    company,
    update,
    orderStates,
    transportOrders,
    orderLines,
    vendorRuc,
    loading,
    orderState,
    setloading,
    getTransportOrders,
    getVendorInformation,
    getOrderLinesByOrderId,
    getOrderLinesForRecId,
  } = useContext(TransportOrderContext);

  const fnSetdataList = useCallback((value) => {
    setdataList(value);
    setFilteredData(value);
  }, []);

  const handleSearch = async (text) => {
    setSearchText(text);
    
    if (!text.trim()) {
      setFilteredData(dataList);
      return;
    }
    
    // Si el usuario está buscando y no hemos cargado las OV, cargarlas automáticamente
    if (!advancedSearchLoaded && text.trim().length >= 2) {
      loadAdvancedSearch();
    }
    
    const searchTerm = text.toLowerCase();
    
    const filtered = dataList.filter((item) => {
      // Buscar por Order ID (OT)
      const matchesOrderId = item.orderId && item.orderId.toLowerCase().includes(searchTerm);
      
      // Buscar por código OT si existe
      const matchesCodigoOT = item.codigoOT && item.codigoOT.toLowerCase().includes(searchTerm);
      
      // Buscar en OV si están cargadas
      const orderLinesForItem = getOrderLinesForRecId(item.recId) || [];
      const matchesOrderLines = orderLinesForItem.some(orderLine => 
        (orderLine.salesOrderId && orderLine.salesOrderId.toLowerCase().includes(searchTerm)) ||
        (orderLine.itemName && orderLine.itemName.toLowerCase().includes(searchTerm)) ||
        (orderLine.itemId && orderLine.itemId.toLowerCase().includes(searchTerm))
      );
      
      return matchesOrderId || matchesCodigoOT || matchesOrderLines;
    });
    
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
    // También limpiamos el estado de expansión
    setExpandedOrders({});
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

  // Cargar información del vendedor al montar el componente
  useEffect(() => {
    getVendorInformation();
  }, []);

  // Actualizar dataList cuando cambian los datos del backend
  useEffect(() => {
    setdataList(transportOrders || []);
    setFilteredData(transportOrders || []);
  }, [transportOrders]);

  useEffect(() => {
    setFilteredData(dataList);
  }, [dataList]);

  // Función para cargar todas las OV para búsqueda avanzada
  const loadAdvancedSearch = async () => {
    if (advancedSearchLoaded || !transportOrders || transportOrders.length === 0) {
      return;
    }

    setLoadingAdvancedSearch(true);
    try {
      const promises = transportOrders.map(order => 
        getOrderLinesByOrderId(company, order.orderId, order.recId).catch(() => null)
      );
      await Promise.all(promises);
      setAdvancedSearchLoaded(true);
    } catch (error) {
      console.error("Error cargando búsqueda avanzada:", error);
    } finally {
      setLoadingAdvancedSearch(false);
    }
  };

  // Función para expandir/colapsar OV de una OT
  const toggleOrderLines = async (orderId, recId) => {
    const isExpanded = expandedOrders[orderId];
    
    if (isExpanded) {
      // Colapsar: remover de expandedOrders
      setExpandedOrders(prev => {
        const newExpanded = { ...prev };
        delete newExpanded[orderId];
        return newExpanded;
      });
    } else {
      // Expandir: cargar OV para este orderId específico
      try {
        await getOrderLinesByOrderId(company, orderId, recId);
        setExpandedOrders(prev => ({
          ...prev,
          [orderId]: true
        }));
      } catch (error) {
        alert("Error al cargar las líneas de orden: " + error);
      }
    }
  };

  // Función para renderizar una OV (OrderLine)
  const renderOrderLine = (orderLine, index) => (
    <View key={`${orderLine.salesOrderId}-${orderLine.lineNum || index}`} style={{
      backgroundColor: "#f8f9fa",
      marginLeft: 20,
      marginTop: 5,
      marginBottom: 5,
      padding: 15,
      borderRadius: 8,
      borderLeftWidth: 3,
      borderLeftColor: redLife,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
        <Text style={{ fontWeight: "bold", color: redStrong, fontSize: 14 }}>
          OV: {orderLine.salesOrderId || "N/A"}
        </Text>
        <Text style={{ color: "#666", fontSize: 12 }}>
          Línea: {orderLine.lineNum || index + 1}
        </Text>
      </View>
      
      <Text style={{ color: "#333", fontSize: 13, marginBottom: 4 }}>
        Producto: {orderLine.itemName || orderLine.itemId || "N/A"}
      </Text>
      
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
        <Text style={{ color: "#666", fontSize: 12 }}>
          Cantidad: {orderLine.qty || orderLine.quantity || "0"}
        </Text>
        <Text style={{ color: "#666", fontSize: 12 }}>
          Estado: {orderLine.status || orderLine.deliveryStatus || "N/A"}
        </Text>
      </View>
      
      {orderLine.deliveryDate && (
        <Text style={{ color: "#666", fontSize: 12, marginTop: 4 }}>
          Entrega: {new Date(orderLine.deliveryDate).toLocaleDateString()}
        </Text>
      )}
    </View>
  );

  // Función para renderizar una OT con sus OV
  const renderTransportOrderWithLines = ({ item: order }) => {
    // Obtener las OV específicas para este recId
    const orderLinesForThisOT = getOrderLinesForRecId(order.recId) || [];
    
    return (
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
        {/* Componente OT original */}
        <Order order={order} />
        
        {/* Botón para expandir/colapsar OV */}
        <TouchableOpacity
          onPress={() => toggleOrderLines(order.orderId, order.recId)}
          style={{
            backgroundColor: expandedOrders[order.orderId] ? redLife : "#f0f0f0",
            padding: 12,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderTopWidth: 1,
            borderTopColor: "#e0e0e0",
          }}
        >
          <Text style={{ 
            color: expandedOrders[order.orderId] ? "#fff" : redStrong, 
            fontWeight: "bold",
            fontSize: 14
          }}>
            {expandedOrders[order.orderId] ? "Ocultar OV" : "Ver OV"}
          </Text>
          <Icon 
            name={expandedOrders[order.orderId] ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
            size={24} 
            color={expandedOrders[order.orderId] ? "#fff" : redStrong} 
          />
        </TouchableOpacity>
        
        {/* Lista de OV expandidas */}
        {expandedOrders[order.orderId] && (
          <View style={{ backgroundColor: "#f8f9fa", padding: 10 }}>
            {orderLinesForThisOT && orderLinesForThisOT.length > 0 ? (
              <>
                <Text style={{ 
                  fontWeight: "bold", 
                  color: redStrong, 
                  marginBottom: 10,
                  fontSize: 16
                }}>
                </Text>
                {orderLinesForThisOT.map((orderLine, index) => renderOrderLine(orderLine, index))}
              </>
            ) : (
              <Text style={{ 
                color: "#666", 
                textAlign: "center", 
                padding: 20,
                fontStyle: "italic"
              }}>
                No hay órdenes de venta para esta OT
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

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
                  placeholder={loadingAdvancedSearch ? "Cargando búsqueda completa..." : "Buscar OT y OV..."}
                  placeholderTextColor={loadingAdvancedSearch ? "#999" : redLife}
                  value={searchText}
                  editable={!loadingAdvancedSearch}
                  onChangeText={(text) => {
                    handleSearch(text);
                  }}
                />
                <TouchableOpacity onPress={handleSortByDate} style={{ marginLeft: 8, padding: 4 }}>
                  <Icon name={sortDesc ? "arrow-downward" : "arrow-upward"} size={24} color={redStrong} />
                </TouchableOpacity>
                
                {/* Indicador de carga de búsqueda avanzada */}
                {loadingAdvancedSearch && (
                  <View style={{ marginLeft: 8 }}>
                    <Loading loading={true} sizeIcon={16} />
                  </View>
                )}
              
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
              
              {/* Botón para aplicar filtro de fecha */}
              <TouchableOpacity
                onPress={filterByDate}
                style={{ backgroundColor: redStrong, padding: 10, borderRadius: 8, marginBottom: 10 }}
              >
                <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
                  Aplicar filtro de fechas
                </Text>
              </TouchableOpacity>
              
              {/* Botón para colapsar todas las OV */}
              <TouchableOpacity
                onPress={() => setExpandedOrders({})}
                style={{ backgroundColor: "#666", padding: 10, borderRadius: 8, marginBottom: 10 }}
              >
                <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
                  Colapsar todas las OV
                </Text>
              </TouchableOpacity>
              
              {/* Información sobre búsqueda */}
              {!advancedSearchLoaded && !loadingAdvancedSearch && (
                <View style={{ 
                  backgroundColor: "#e3f2fd", 
                  padding: 12, 
                  borderRadius: 8, 
                  marginBottom: 10,
                  borderLeftWidth: 4,
                  borderLeftColor: "#2196f3"
                }}>
                  <Text style={{ color: "#1565c0", fontSize: 13, textAlign: "center" }}>
                    💡 Escribe 2+ caracteres para buscar en todas las OV automáticamente
                  </Text>
                </View>
              )}
              
              {advancedSearchLoaded && (
                <View style={{ 
                  backgroundColor: "#d4edda", 
                  padding: 12, 
                  borderRadius: 8, 
                  marginBottom: 10,
                  borderLeftWidth: 4,
                  borderLeftColor: "#28a745"
                }}>
                  <Text style={{ color: "#155724", fontSize: 13, textAlign: "center" }}>
                    ✅ Búsqueda completa activada - Buscando en OT y OV
                  </Text>
                </View>
              )}
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
          renderItem={renderTransportOrderWithLines}
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
          onEndReachedThreshold={0.1}
          ItemSeparatorComponent={<View style={{ height: 12 }} />}
          maxToRenderPerBatch={5}
          windowSize={10}
          initialNumToRender={5}
          removeClippedSubviews={true}
          getItemLayout={(data, index) => ({
            length: 200, // altura estimada de cada item
            offset: 212 * index, // altura + separator
            index,
          })}
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