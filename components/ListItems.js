import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import GlobalContext from "../context/Context";
import { Col, Grid, Row } from "react-native-easy-grid";
import Avatar from "./Avatar";

const ListItems = ({ style, type, description, user, time, room, image }) => {
  const { navigate } = useNavigation();
  const {
    theme: { lightTheme, darkTheme },
    lightMode,
  } = useContext(GlobalContext);

  const theme = lightMode ? lightTheme.colors : darkTheme.colors;

  return (
    <TouchableOpacity
      onPress={() =>
        navigate("chat", {
          user,
          room,
          image,
        })
      }
      style={{
        height: 80,
        ...style,
      }}
    >
      <Grid
        style={{
          maxHeight: 80,
        }}
      >
        <Col
          style={{
            width: 80,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar user={user} size={type === "contacts" ? 40 : 65} />
        </Col>
        <Col
          style={{
            marginLeft: 10,
          }}
        >
          <Row
            style={{
              alignItems: "center",
            }}
          >
            <Col>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: theme.text,
                }}
              >
                {user?.contactName || user?.displayName}
              </Text>
            </Col>
            {time && (
              <Col style={{ alignItems: "flex-end" }}>
                <Text
                  style={{
                    color: theme.secondaryText,
                    fontSize: 11,
                  }}
                >
                  {new Date(time.seconds).toLocaleTimeString()}
                </Text>
              </Col>
            )}
          </Row>
          {description && (
            <Row style={{ marginTop: -5 }}>
              <Text
                style={{
                  color: theme.secondaryText,
                  fontSize: 13,
                }}
              >
                {description}
              </Text>
            </Row>
          )}
        </Col>
      </Grid>
    </TouchableOpacity>
  );
};

export default ListItems;
