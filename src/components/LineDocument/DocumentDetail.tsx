import React, { useContext, useState } from "react";
import { Pressable, Text, View } from "react-native";
import styles from "./style";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import UploadBtn from "../Buttons/Upload";
import DeleteBtn from "../Buttons/DeleteBtn";
import ModalChooseFile from "../Camera/ModalChooseFile";
import { OrderLineContext } from "../../context/TransportOrderLines/OrderLineContext";
import { TransportOrderContext } from "../../context/TransportOrder/TransportOrderContext";
import Loading from "../Loading/Loading";

export interface Document {
  recId: string;
  documentName: string;
  mandatory: number;
  attachRecId: number;
  url: string;
}

interface DocumentDetailProps {
  item: Document;
}

const DocumentDetail: React.FC<DocumentDetailProps> = ({ item }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { deleteSPDocumentation, postAXUpdateDocumentation, setUpdate } =
    useContext(OrderLineContext)!;
  const { company } = useContext(TransportOrderContext)!;
  const [openModal, setopenModal] = useState<boolean>(false);
  const [loading, setloading] = useState<boolean>(false);

  const fnHandleDeleteFile = async (url: string, recIdDocument: string) => {
    try {
      setloading(true);
      const respSP = await deleteSPDocumentation(url);
      if (respSP) {
        const respAX = await postAXUpdateDocumentation(
          company,
          recIdDocument,
          0,
          0
        );
        if (respAX > 0) {
          setUpdate(true);
        }
      } else {
        alert("No se ha eliminado el archivo.");
      }
      setloading(false);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <Loading loading={loading} />
      {openModal && (
        <ModalChooseFile
          open={openModal}
          setOpen={setopenModal}
          document={item}
        />
      )}{/* holasss */}
      <Pressable
        onPress={() =>
          navigation.navigate("DocumentsScreen", { document: item })
        }
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "white" : "#D8D8D8",
          },
          styles.viewDoc,
        ]}
      >
        <View style={styles.row}>
          <View style={[styles.column, { width: "50%" }]}>
            <Text
              style={[
                styles.subTitle,
                {
                  textAlign: "left",
                },
              ]}
            >
              {item.documentName.substring(0, 35)}
            </Text>
            <Text style={styles.text}>
              {item.mandatory === 1 && "Documento Obligatorio"}
            </Text>
          </View>
          <View style={{ width: "50%" }}>
            {item.attachRecId > 0 ? (
              <View style={styles.row}>
                <View
                  style={{
                    width: "50%",
                    marginRight: 5,
                  }}
                >
                  <UploadBtn onPress={() => setopenModal(!openModal)} />
                </View>
                <View style={{ width: "50%" }}>
                  <DeleteBtn
                    onPress={() => fnHandleDeleteFile(item.url, item.recId)}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.row}>
                <View style={{ width: "100%" }}>
                  <UploadBtn onPress={() => setopenModal(!openModal)} />
                </View>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </>
  );
};

export default DocumentDetail;