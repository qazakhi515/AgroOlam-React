import { Box, Container, Stack } from "@mui/material";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import { CssVarsProvider } from "@mui/joy/styles";
import Typography from "@mui/joy/Typography";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveTopUsers } from "./selector";
import { serverApi, getMemberImageSrc } from "../../../lib/config";
import { Member } from "../../../lib/types/member";

const topUsersRetriever = createSelector(retrieveTopUsers, (topUsers) => ({
  topUsers,
}));
export default function ActiveUsers() {
  const { topUsers } = useSelector(topUsersRetriever);
  return (
    <div className={"active-users-frame"}>
      <Container>
        <Stack className={"main"}>
          <Box className={"category-title"}>Active Users</Box>
          <Stack className={"cards-frame"}>
            <CssVarsProvider>
              {topUsers.length !== 0 ? (
                topUsers.map((member: Member) => {
                  const imagePath = getMemberImageSrc(member.memberImage);
                  return (
                    <Card
                      key={member._id}
                      variant="outlined"
                      className={"card"}
                    >
                      <AspectRatio ratio="1">
                        <img
                          src={imagePath}
                          alt={member.memberNick || "Farmer"}
                          onError={(e: any) => {
                            e.target.onerror = null;
                            e.target.src = "/icons/default-user.svg";
                          }}
                        />
                      </AspectRatio>

                      <CardOverflow
                        variant="soft"
                        className="active-users-detail"
                      >
                        <Stack className="info">
                          <Typography className={"member-nickname"}>
                            {member.memberNick}
                          </Typography>
                        </Stack>
                      </CardOverflow>
                    </Card>
                  );
                })
              ) : (
                <Box className="no-data">No Active Users</Box>
              )}
            </CssVarsProvider>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
