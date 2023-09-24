import { Grid, Paper, Text } from "@mantine/core"

export const LeaderboardTable = () => {
    return (
        <> 
            <Paper radius='xl' shadow='sm' style={{padding: '3px', width: '80%'}} withBorder>
                <Grid justify='center'>
                    <Grid.Col span={3}><Text ta='center' size='xl'>Rank</Text></Grid.Col>
                    <Grid.Col span={3}><Text ta='center' size='xl'>Username</Text></Grid.Col>
                    <Grid.Col span={3}><Text ta='center' size='xl'>Level</Text></Grid.Col>
                    <Grid.Col span={3}><Text ta='center' size='xl'>Exp</Text></Grid.Col>
                </Grid>
            </Paper>
            <LeaderboardTableRow rank={1} username='kanelooc' level={102} exp={5121231341}/>
            <LeaderboardTableRow rank={1} username='tim' level={67} exp={512123341} alternate/>
            <LeaderboardTableRow rank={1} username='asasasasdina' level={42} exp={51221341}/>
            <LeaderboardTableRow rank={1} username='al' level={9} exp={512312341} alternate/>
            <LeaderboardTableRow rank={1} username='timmy' level={9} exp={511232341}/>
            <LeaderboardTableRow rank={1} username='boat' level={9} exp={51221341} alternate/>
            <LeaderboardTableRow rank={1} username='asda' level={9} exp={51231241}/>
            <LeaderboardTableRow rank={1} username='kanelasdasdaooc' level={9} exp={5112341} alternate/>
            <LeaderboardTableRow rank={1} username='asdasdasdasda' level={9} exp={51222341}/>
            <LeaderboardTableRow rank={1} username='asdad' level={9} exp={5212341} alternate/>
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
        <Paper radius='xl' shadow='sm' style={{padding: '10px', width: '80%', backgroundColor: props.alternate ? '#f3f3f3' : 'white '}}>
            <Grid justify='center'>
                <Grid.Col span={3}><Text ta='center' size='xl'>{props.rank}</Text></Grid.Col>
                <Grid.Col span={3}><Text ta='center' size='xl'>{props.username}</Text></Grid.Col>
                <Grid.Col span={3}><Text ta='center' size='xl'>Lv. {props.level}</Text></Grid.Col>
                <Grid.Col span={3}><Text ta='center' size='xl'>{props.exp} EXP</Text></Grid.Col>
            </Grid>
            {/* <Flex align='center' gap='xl' justify='space-around'>
                
                
                
                
            </Flex> */}
        </Paper>
    )
}