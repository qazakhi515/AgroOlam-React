import React from "react";
import { Box, Button, Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import CancelIcon from "@mui/icons-material/Cancel";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import { Messages, serverApi } from "../../../lib/config";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../hooks/useGlobals";
import { Message } from "@mui/icons-material";
import OrderService from "../../services/OrdersService";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { chemicalIncompatibilities, ChemicalRule } from "../../../lib/data/agroRules";
interface BasketProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
}

export default function Basket(props: BasketProps) {
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const history = useHistory();
  const itemsPrice: number = cartItems.reduce(
    (a: number, c: CartItem) => a + c.quantity * c.price,
    0,
  );
  const shippingCost = itemsPrice < 100 ? 5 : 0;
  const totalPrice = (itemsPrice + shippingCost).toFixed(1);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Check chemical incompatibilities (Domain Moat)
  const detectedConflicts: ChemicalRule[] = React.useMemo(() => {
    if (cartItems.length < 2) return [];
    const itemTexts = cartItems.map((it) => it.name.toLowerCase());
    const conflicts: ChemicalRule[] = [];

    for (const rule of chemicalIncompatibilities) {
      const satisfied = rule.substances.filter((sub) => {
        return itemTexts.some((text) => {
          if (sub === "copper") return text.includes("copper") || text.includes("mis") || text.includes("kupro");
          if (sub === "sulfur") return text.includes("sulfur") || text.includes("oltingugurt") || text.includes("thiovit");
          if (sub === "captan") return text.includes("captan") || text.includes("kaptan") || text.includes("merpan");
          if (sub === "mineral_oil") return text.includes("oil") || text.includes("moy") || text.includes("mineral");
          if (sub === "calcium") return text.includes("calcium") || text.includes("kalsiy") || text.includes("selitra");
          if (sub === "phosphate") return text.includes("phosphate") || text.includes("fosfat") || text.includes("ammophos");
          return text.includes(sub);
        });
      });

      if (satisfied.length >= rule.substances.length) {
        conflicts.push(rule);
      }
    }
    return conflicts;
  }, [cartItems]);

  /** HANDLERS **/
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const proceedOrderHandler = async () => {
    try {
      handleClose();
      if (!authMember) throw new Error(Messages.error2);

      const order = new OrderService();
      await order.createOrder(cartItems);

      onDeleteAll();

      setOrderBuilder(new Date());
      history.push("/orders");
    } catch (err) {
      console.log("first", err);
      sweetErrorHandling(err).then();
    }
  };
  return (
    <Box className={"hover-line"}>
      <IconButton
        aria-label="cart"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Badge badgeContent={cartItems.length} color="secondary">
          <img src={"/icons/shopping-cart.svg"} />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        // onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Stack className={"basket-frame"}>
          <Box className={"all-check-box"}>
            {cartItems.length === 0 ? (
              <div>Cart is empty!</div>
            ) : (
              <Stack flexDirection={"row"}>
                <div>Cart Products:</div>
                <DeleteForeverIcon
                  sx={{ ml: "5px", cursor: "pointer" }}
                  color={"primary"}
                  onClick={() => onDeleteAll()}
                />
              </Stack>
            )}
          </Box>

          <Box className={"orders-main-wrapper"}>
            <Box className={"orders-wrapper"}>
              {cartItems.map((item: CartItem) => {
                const imagePath = `${serverApi}/${item.image}`;
                return (
                  <Box className={"basket-info-box"} key={item._id}>
                    <div className={"cancel-btn"}>
                      <CancelIcon
                        color={"primary"}
                        onClick={() => onDelete(item)}
                      />
                    </div>
                    <img src={imagePath} className={"product-img"} />
                    <span className={"product-name"}>{item.name}</span>
                    <p className={"product-price"}>
                      {item.quantity} x {item.price}
                    </p>
                    <Box sx={{ minWidth: 120 }}>
                      <div className="col-2">
                        <button
                          onClick={() => onRemove(item)}
                          className="remove"
                        >
                          -
                        </button>{" "}
                        <button onClick={() => onAdd(item)} className="add">
                          +
                        </button>
                      </div>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {detectedConflicts.length > 0 && (
            <Box sx={{ px: 2, py: 1, maxWidth: 360 }}>
              {detectedConflicts.map((conflict, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    borderRadius: "8px",
                    bgcolor: conflict.severity === "DANGER" ? "#ffebee" : "#fff8e1",
                    border:
                      conflict.severity === "DANGER"
                        ? "1px solid #ef5350"
                        : "1px solid #ffa726",
                    fontSize: 12,
                  }}
                >
                  <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.5 }}>
                    <WarningAmberIcon
                      sx={{
                        color: conflict.severity === "DANGER" ? "#d32f2f" : "#f57c00",
                        fontSize: 18,
                      }}
                    />
                    <strong
                      style={{
                        color: conflict.severity === "DANGER" ? "#d32f2f" : "#e65100",
                        fontSize: 12,
                      }}
                    >
                      {conflict.title}
                    </strong>
                  </Stack>
                  <div style={{ color: "#333", marginBottom: 4, lineHeight: 1.3 }}>
                    {conflict.reason}
                  </div>
                  <div style={{ color: "#2e7d32", fontWeight: 600, fontSize: 11 }}>
                    💡 {conflict.recommendation}
                  </div>
                </Box>
              ))}
            </Box>
          )}

          {cartItems.length !== 0 ? (
            <Box className={"basket-order"}>
              <span className={"price"}>
                Total: ${totalPrice} ({itemsPrice} + {shippingCost})
              </span>
              <Button
                onClick={proceedOrderHandler}
                startIcon={<ShoppingCartIcon />}
                variant={"contained"}
              >
                Order
              </Button>
            </Box>
          ) : (
            ""
          )}
        </Stack>
      </Menu>
    </Box>
  );
}
