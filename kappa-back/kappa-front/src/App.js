import React, { useState } from "react";
import MainComponent from "./components/MainComponent";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ConfigureStore } from "./redux/configureStore";
import { IntlProvider } from "react-intl";
import messages from "./assets/messages";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./App.scss";

const store = ConfigureStore();

const theme = createMuiTheme({
  typography: {
    fontFamily: "Poppins",
  },
});

const lengInitial = window.navigator.language.startsWith("es") ? "es" : "en";

function App() {
  const [language, setLanguage] = useState(lengInitial);

  return (
    <ThemeProvider theme={theme}>
      <IntlProvider locale={language} messages={messages[language]}>
        <Provider store={store}>
          <BrowserRouter>
            <div className="App">
              <MainComponent language={language} setLanguage={setLanguage} />
            </div>
          </BrowserRouter>
        </Provider>
      </IntlProvider>
    </ThemeProvider>
  );
}

export default App;
