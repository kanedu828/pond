import { Grid, Pagination, Paper, Text } from "@mantine/core"
import { useState } from "react"
import { PondUser } from "../../../shared/types/types"
import { expToLevel } from "../util/exp"
import { paginateArray } from "../util/util"

interface LeaderboardTableProps {
    users: PondUser[]
}

export const LeaderboardTable = (props: LeaderboardTableProps) => {

    const paginatedUsers = paginateArray(props.users, 10);
    const [activePage, setPage] = useState<number>(1);

    return (
        <> 
            <Paper radius='lg' shadow='xs' style={{padding: '3px', width: '80%'}} withBorder>
                <Grid justify='center'>
                    <Grid.Col span={3}><Text ta='center' size='xl'>Rank</Text></Grid.Col>
                    <Grid.Col span={3}><Text ta='center' size='xl'>Username</Text></Grid.Col>
                    <Grid.Col span={3}><Text ta='center' size='xl'>Level</Text></Grid.Col>
                    <Grid.Col span={3}><Text ta='center' size='xl'>Exp</Text></Grid.Col>
                </Grid>
            </Paper>
            {paginatedUsers[activePage - 1].map((u, i) => {
                return <LeaderboardTableRow rank={i + 1} username={u.username} level={u.exp && expToLevel(u.exp)} exp={u.exp} alternate={i % 2 === 1}/>
            })}
            <Pagination value={activePage} onChange={setPage} total={paginatedUsers.length} />
        </>
    )
}

interface LeaderboardTableRowProps {
    rank: number,
    username: string,
    level: number,
    exp: number
    alternate?: boolean
}

const LeaderboardTableRow = (props: LeaderboardTableRowProps) => {
    return (
        <Paper radius='lg' shadow='xs' style={{padding: '10px', width: '80%', backgroundColor: props.alternate ? '#f3f3f3' : 'white '}}>
            <Grid justify='center'>
                <Grid.Col span={3}><Text ta='center' size='xl'>{props.rank}</Text></Grid.Col>
                <Grid.Col span={3}><Text truncate='end' ta='center' size='xl'>{props.username}</Text></Grid.Col>
                <Grid.Col span={3}><Text ta='center' size='xl'>{props.level}</Text></Grid.Col>
                <Grid.Col span={3}><Text ta='center' size='xl'>{props.exp}</Text></Grid.Col>
            </Grid>
        </Paper>
    )
}