import { Grid, Paper, Text } from "@mantine/core"
import { PondUser } from "../../../shared/types/types"
import { expToLevel } from "../util/exp"

interface LeaderboardTableProps {
    users: PondUser[]
}

export const LeaderboardTable = (props: LeaderboardTableProps) => {
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
            {props.users.map((u, i) => {
                return <LeaderboardTableRow rank={i + 1} username={u.username} level={expToLevel(u.exp)} exp={u.exp} alternate={i % 2 === 1}/>
            })}
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