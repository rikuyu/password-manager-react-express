import "./App.css";
import { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Axios from "axios";

function App() {
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [passwordList, setPasswordList] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3001/show").then((response) => {
      setPasswordList(response.data);
    });
  }, []);

  const handleRegister = () => {
    Axios.post("http://localhost:3001/register", {
      password: password,
      title: title,
    }).then((response) => {
      console.log("SUCCESS");
      console.log(response);
    });
  };

  const handleDecrypt = (encryption) => {
    Axios.post("http://localhost:3001/decrypt", {
      password: encryption.password,
      iv: encryption.iv,
    }).then((response) => {
      setPasswordList(
        passwordList.map((value) => {
          return value.id === encryption.id
            ? {
                id: value.id,
                password: value.title,
                title: response.data,
                iv: value.iv,
              }
            : value;
        })
      );
      console.log(passwordList);
    });
  };

  return (
    <div className="container">
      <div className="inputItem">
        <TextField
          className="input"
          id="outlined-basic"
          label="タイトル"
          variant="outlined"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <TextField
          className="input"
          id="outlined-basic"
          label="登録パスワード"
          variant="outlined"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <Button
          id="button"
          variant="contained"
          color="primary"
          onClick={handleRegister}
        >
          登録
        </Button>
      </div>
      <div className="passewords">
        {passwordList.map((value, index) => {
          return (
            <div key={index}>
              <Card variant="outlined" className="card">
                <CardContent className="cardContent">
                  <Typography variant="h5">{value.title}</Typography>
                  <Button
                    className="button"
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => {
                      handleDecrypt({
                        password: value.password,
                        iv: value.iv,
                        id: value.id,
                      });
                    }}
                  >
                    パスワード表示
                  </Button>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
