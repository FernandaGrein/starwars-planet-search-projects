/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import App from "../App";
import userEvent from "@testing-library/user-event";
import mockData from "./mockData";

describe("teste da tabela", () => {
  beforeEach(() => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
      })
    );
  });

  afterEach(() => jest.clearAllMocks());
  it("testa se há uma tabela", () => {
    render(<App />);
    const tableElement = screen.getByRole("table");
    expect(tableElement).toBeInTheDocument();
  });

  it("testa se o cabeçalho da tabela possui 13 itens", () => {
    render(<App />);
    const tHeadEl = screen.getAllByRole("columnheader");
    expect(tHeadEl).toHaveLength(13);
  });

  it("testa os nomes no cabeçalho", () => {
    render(<App />);
    const theadArray = [
      "Name",
      "Rotation Period",
      "Orbital Period",
      "Diameter",
      "Climate",
      "Gravity",
      "Terrain",
      "Surface Water",
      "Population",
      "Films",
      "created",
      "edited",
      "url",
    ];
    theadArray.forEach((item) => {
      const itemElem = screen.getByRole("columnheader", { name: item });
      expect(itemElem).toBeInTheDocument();
    });
  });

  it("testa se a tabela tem 10 linhas", async () => {
    render(<App />);
    const linesElemnt = await screen.findAllByLabelText("row");
    await waitFor(() => {
      expect(linesElemnt).toHaveLength(10);
    }, 3000);
  });
});

describe("testa a existência do formulario", () => {
  beforeEach(() => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
      })
    );
  });

  afterEach(() => jest.clearAllMocks());
  it("testa se os inputs existem na tela", () => {
    render(<App />);
    const textinputEl = screen.getByRole("textbox");
    const numberInputEl = screen.getByRole("textbox");
    const filterbuttonEl = screen.getByRole("button", { name: /filtrar/i });
    const removeFilter = screen.getByRole("button", {
      name: /remover todas filtragens/i,
    });
    const selectInputColum = screen.getByTestId("column-filter");
    const comparisonInput = screen.getByTestId("comparison-filter");

    expect(textinputEl).toBeInTheDocument();
    expect(numberInputEl).toBeInTheDocument();
    expect(filterbuttonEl).toBeInTheDocument();
    expect(removeFilter).toBeInTheDocument();
    expect(selectInputColum).toBeInTheDocument();
    expect(comparisonInput).toBeInTheDocument();
  });
});

describe("testa se é possível filtrar a tabela", () => {
  beforeEach(() => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
      })
    );
  });

  afterEach(() => jest.clearAllMocks());
  it("testa se é possível filtar escrevendo no texto", async () => {
    render(<App />);
    const textinputEl = screen.getByRole("textbox");
    const planetOne = await screen.findByText("Bespin");

    userEvent.type(textinputEl, "oo");

    const linesElemnt = await screen.findAllByLabelText("row");
    const planetTwo = await screen.findByText("Naboo");

    await waitFor(() => {
      expect(linesElemnt).toHaveLength(2);
      expect(planetOne).not.toBeInTheDocument();
      expect(planetTwo).toBeInTheDocument();
    }, 3000);
  });
  it("testa se é possível filtrar pelos inputs", async () => {
    render(<App />);
    const linesElemnt = await screen.findAllByLabelText("row");
    expect(linesElemnt).toHaveLength(10);

    const numberInputEl = screen.getByRole("spinbutton");
    const filterbuttonEl = screen.getByRole("button", { name: /filtrar/i });
    // const removeFilter = screen.getByRole('button', {  name: /remover todas filtragens/i})
    const selectInputColum = screen.getByTestId("column-filter");
    const comparisonInput = screen.getByTestId("comparison-filter");

    userEvent.selectOptions(selectInputColum, "orbital_period");
    userEvent.selectOptions(comparisonInput, "maior que");

    userEvent.type(numberInputEl, "500");
    userEvent.click(filterbuttonEl);

    expect(selectInputColum).toHaveValue("orbital_period");
    expect(comparisonInput).toHaveValue("maior que");

    const planetOne = await screen.findByText("Bespin");
    const planetTwo = await screen.findByText("Hoth");

    await waitFor(() => {
      expect(screen.getAllByLabelText("row")).toHaveLength(3);
      expect(planetOne).toBeInTheDocument();
      expect(planetTwo).toBeInTheDocument();
    }, 3000);

    // userEvent.click(screen.getByRole('button', {  name: /remover todas filtragens/i}))
  });

  it("testa se é possível adicionar dois filtros", async () => {
    render(<App />);
    const linesElemnt = await screen.findAllByLabelText("row");
    expect(linesElemnt).toHaveLength(10);

    const numberInputEl = screen.getByRole("spinbutton");
    const filterbuttonEl = screen.getByRole("button", { name: /filtrar/i });
    const selectInputColum = screen.getByTestId("column-filter");
    const comparisonInput = screen.getByTestId("comparison-filter");

    userEvent.selectOptions(selectInputColum, "orbital_period");
    userEvent.selectOptions(comparisonInput, "maior que");

    userEvent.type(numberInputEl, "400");
    userEvent.click(filterbuttonEl);

    userEvent.selectOptions(selectInputColum, "rotation_period");
    userEvent.selectOptions(comparisonInput, "maior que");

    userEvent.type(numberInputEl, "20");
    userEvent.click(filterbuttonEl);

    // await waitFor(() => {
    //   expect(screen.findAllByLabelText('row')).toHaveLength(3)
    //   expect(screen.getByText(/orbital_period \| maior que \| 400/i)).toBeInTheDocument();
    //   expect(screen.getByText(/rotation_period \| maior que \| 20/i)).toBeInTheDocument();
    // })
  });
});
