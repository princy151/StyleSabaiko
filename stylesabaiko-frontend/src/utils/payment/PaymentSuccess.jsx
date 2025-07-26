import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pidx = params.get("pidx");

    const verifyPayment = async () => {
      try {
        const res = await axios.post(
          "https://dev.khalti.com/api/v2/epayment/lookup/",
          { pidx },
          {
            headers: {
              Authorization: "Key 6fa778cd3be54fbcb62eaf35b71c0ae8",
            },
          }
        );

        if (res.data.status === "Completed") {
          toast.success("✅ Payment Successful!");
        } else {
          toast.error("❌ Payment Failed: " + res.data.status);
        }
      } catch (error) {
        toast.error("❌ Error verifying payment");
      }
    };

    if (pidx) {
      verifyPayment();
    }
  }, [location]);

  return (
    <div style={{ padding: "50px" }}>
      <h2>Verifying your payment...</h2>
    </div>
  );
};

export default PaymentSuccess;
