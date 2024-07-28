import { useGetTopHundredUsersByExp } from "../hooks/api/UseUserClient";
import { LeaderboardTable } from "./LeaderboardTable";
import { ModalContainer } from "./ModalContainer";

interface LeaderboardProps {
  isOpen: boolean;
  close: any;
}

export const Leaderboard = (props: LeaderboardProps) => {
  const { data, isLoading } = useGetTopHundredUsersByExp();

  return (
    <ModalContainer isOpen={props.isOpen} close={props.close} isLoading={isLoading} title="Leaderboard">
      <LeaderboardTable users={data ?? []} />
    </ModalContainer>
  );
};
