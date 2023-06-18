import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { CircularProgress, makeStyles } from "@material-ui/core";
import { HistoricalChart } from "./config/api";
import { CryptoState } from "../CryptoContext";

const CoinsGraph = ({ coinId }) => {
  const [historicData, setHistoricData] = useState([]);
  const { currency } = CryptoState();
  const [loading, setLoading] = useState(true);

  const useStyles = makeStyles((theme) => ({
    graphContainer: {
      width: "100%",
      position: "relative",
    },
    graph: {
      width: "20%",
    },
    loading: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
  }));

  const classes = useStyles();

  const fetchHistoricData = async () => {
    try {
      const { data } = await axios.get(HistoricalChart(coinId, 24, currency));
      setHistoricData(data.prices);
    } catch (error) {
      console.error("Error fetching historical data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHistoricData();
  }, [coinId, currency]);

  return (
    <div className={classes.graphContainer}>
      {loading ? (
        <CircularProgress className={classes.loading} />
      ) : (
        <Line
          className={classes.graph}
          data={{
            labels: historicData.map((coin) => {
              const date = new Date(coin[0]);
              const time = `${date.getHours()}:${date.getMinutes()}`;
              return time;
            }),
            datasets: [
              {
                data: historicData.map((coin) => coin[1]),
                label: `Price (Past 6 Hours) in ${currency}`,
                borderColor: "#EEBC1D",
              },
            ],
          }}
          options={{
            elements: {
              point: {
                radius: 0,
              },
            },
            scales: {
              x: {
                display: false,
              },
              y: {
                display: false,
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: false,
              },
            },
            layout: {
              padding: 0, // Adjust the padding as needed
            },
            maintainAspectRatio: false, // Allow the graph to adjust to the container size
          }}
          height={150} // Adjust the height as per your preference
        />
      )}
    </div>
  );
};

export default CoinsGraph;
