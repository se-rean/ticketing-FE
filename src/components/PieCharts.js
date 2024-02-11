import React, {
  useEffect, memo, useState
} from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

const data = {
  'is_success': true,
  'errors': null,
  'data': [
    {
      'id': 34,
      'performance_code': 'PDUB01DEC2023B',
      'title': 'asd',
      'status': 'Completed',
      'description': 'asd',
      'name': 'Batch 3 API upgrade',
      'start_date': '2023-12-01T19:30:00',
      'end_date': '2028-12-01T23:00:00',
      'web_sale_start_date': '2023-12-01T19:30:00',
      'show_code': 'SBAT23C',
      'web_sale_end_date': '2028-12-01T23:00:00',
      'venue_code': 'DUBAI WORLD TRADE CENTRE L.L.C[DED-229599],DUBAI WORLD TRADE CENTRE L.L.C[DED-229599]',
      'created_at': '2024-02-01T08:52:18.000Z',
      'updated_at': '2024-02-02T02:38:31.000Z'
    },
    {
      'id': 35,
      'performance_code': 'PDUB01DEC2023Bs',
      'title': 'asdfasdf',
      'status': 'Completed',
      'description': 'asdf',
      'name': null,
      'start_date': null,
      'end_date': null,
      'web_sale_start_date': null,
      'show_code': null,
      'web_sale_end_date': null,
      'venue_code': null,
      'created_at': '2024-02-01T10:09:51.000Z',
      'updated_at': '2024-02-01T10:09:51.000Z'
    },
    {
      'id': 36,
      'performance_code': 'PDUB0',
      'title': 'asd',
      'status': 'Pending For Barcode Generation',
      'description': 'asdasd',
      'name': null,
      'start_date': null,
      'end_date': null,
      'web_sale_start_date': null,
      'show_code': null,
      'web_sale_end_date': null,
      'venue_code': null,
      'created_at': '2024-02-01T10:10:38.000Z',
      'updated_at': '2024-02-01T10:10:38.000Z'
    },
    {
      'id': 37,
      'performance_code': 'asdasdfasdfas',
      'title': 'asdf',
      'status': 'CANCELLED',
      'description': 'asdf',
      'name': null,
      'start_date': null,
      'end_date': null,
      'web_sale_start_date': null,
      'show_code': null,
      'web_sale_end_date': null,
      'venue_code': null,
      'created_at': '2024-02-01T10:13:47.000Z',
      'updated_at': '2024-02-01T10:13:47.000Z'
    },
    {
      'id': 38,
      'performance_code': 'asdasd',
      'title': 'asd',
      'status': 'Pending For Barcode Generation',
      'description': 'asd',
      'name': null,
      'start_date': null,
      'end_date': null,
      'web_sale_start_date': null,
      'show_code': null,
      'web_sale_end_date': null,
      'venue_code': null,
      'created_at': '2024-02-01T10:19:58.000Z',
      'updated_at': '2024-02-01T10:19:58.000Z'
    },
    {
      'id': 39,
      'performance_code': 'title',
      'title': 'title sample',
      'status': 'Pending For Barcode Generation',
      'description': 'description sample',
      'name': null,
      'start_date': null,
      'end_date': null,
      'web_sale_start_date': null,
      'show_code': null,
      'web_sale_end_date': null,
      'venue_code': null,
      'created_at': '2024-02-01T14:15:21.000Z',
      'updated_at': '2024-02-01T14:15:21.000Z'
    },
    {
      'id': 40,
      'performance_code': 'test',
      'title': 'asd',
      'status': 'Pending For Barcode Generation',
      'description': 'asd',
      'name': null,
      'start_date': null,
      'end_date': null,
      'web_sale_start_date': null,
      'show_code': null,
      'web_sale_end_date': null,
      'venue_code': null,
      'created_at': '2024-02-01T14:24:53.000Z',
      'updated_at': '2024-02-01T14:24:53.000Z'
    },
    {
      'id': 41,
      'performance_code': 'fasdfasd',
      'title': 'asd',
      'status': 'Pending For Barcode Generation',
      'description': 'asd',
      'name': null,
      'start_date': null,
      'end_date': null,
      'web_sale_start_date': null,
      'show_code': null,
      'web_sale_end_date': null,
      'venue_code': null,
      'created_at': '2024-02-01T14:28:23.000Z',
      'updated_at': '2024-02-01T14:28:23.000Z'
    },
    {
      'id': 42,
      'performance_code': 'sample',
      'title': 'sample',
      'status': 'Pending For Barcode Generation',
      'description': 'sample',
      'name': null,
      'start_date': null,
      'end_date': null,
      'web_sale_start_date': null,
      'show_code': null,
      'web_sale_end_date': null,
      'venue_code': null,
      'created_at': '2024-02-01T14:29:34.000Z',
      'updated_at': '2024-02-01T14:29:34.000Z'
    },
    {
      'id': 43,
      'performance_code': 'asdasdasd',
      'title': 'asd',
      'status': 'Pending For Barcode Generation',
      'description': 'asd',
      'name': null,
      'start_date': null,
      'end_date': null,
      'web_sale_start_date': null,
      'show_code': null,
      'web_sale_end_date': null,
      'venue_code': null,
      'created_at': '2024-02-01T14:32:03.000Z',
      'updated_at': '2024-02-01T14:32:03.000Z'
    },
    {
      'id': 44,
      'performance_code': 'asd',
      'title': 'asdas',
      'status': 'Pending For Barcode Generation',
      'description': 'asd',
      'name': null,
      'start_date': null,
      'end_date': null,
      'web_sale_start_date': null,
      'show_code': null,
      'web_sale_end_date': null,
      'venue_code': null,
      'created_at': '2024-02-01T14:35:22.000Z',
      'updated_at': '2024-02-01T14:35:22.000Z'
    },
    {
      'id': 45,
      'performance_code': 'test1',
      'title': 'test',
      'status': 'Pending For Barcode Generation',
      'description': 'test',
      'name': null,
      'start_date': null,
      'end_date': null,
      'web_sale_start_date': null,
      'show_code': null,
      'web_sale_end_date': null,
      'venue_code': null,
      'created_at': '2024-02-01T14:39:37.000Z',
      'updated_at': '2024-02-01T14:39:37.000Z'
    },
    {
      'id': 46,
      'performance_code': 'test2',
      'title': 'test',
      'status': 'CANCELLED',
      'description': 'test',
      'name': null,
      'start_date': null,
      'end_date': null,
      'web_sale_start_date': null,
      'show_code': null,
      'web_sale_end_date': null,
      'venue_code': null,
      'created_at': '2024-02-01T15:02:45.000Z',
      'updated_at': '2024-02-01T15:02:45.000Z'
    },
    {
      'id': 47,
      'performance_code': 'test123',
      'title': 'test',
      'status': 'CANCELLED',
      'description': '123',
      'name': null,
      'start_date': null,
      'end_date': null,
      'web_sale_start_date': null,
      'show_code': null,
      'web_sale_end_date': null,
      'venue_code': null,
      'created_at': '2024-02-01T15:03:21.000Z',
      'updated_at': '2024-02-01T15:03:21.000Z'
    },
    {
      'id': 48,
      'performance_code': '123',
      'title': '123',
      'status': 'Pending For Barcode Generation',
      'description': '123',
      'name': null,
      'start_date': null,
      'end_date': null,
      'web_sale_start_date': null,
      'show_code': null,
      'web_sale_end_date': null,
      'venue_code': null,
      'created_at': '2024-02-01T15:03:49.000Z',
      'updated_at': '2024-02-01T15:03:49.000Z'
    },
    {
      'id': 49,
      'performance_code': '1234',
      'title': '1234',
      'status': 'Pending For Barcode Generation',
      'description': '1234',
      'name': null,
      'start_date': null,
      'end_date': null,
      'web_sale_start_date': null,
      'show_code': null,
      'web_sale_end_date': null,
      'venue_code': null,
      'created_at': '2024-02-01T15:04:45.000Z',
      'updated_at': '2024-02-01T15:04:45.000Z'
    },
    {
      'id': 50,
      'performance_code': '12345',
      'title': '1234',
      'status': 'Pending For Barcode Generation',
      'description': '1234',
      'name': null,
      'start_date': null,
      'end_date': null,
      'web_sale_start_date': null,
      'show_code': null,
      'web_sale_end_date': null,
      'venue_code': null,
      'created_at': '2024-02-01T15:18:36.000Z',
      'updated_at': '2024-02-01T15:18:36.000Z'
    },
    {
      'id': 51,
      'performance_code': '123123',
      'title': '123132',
      'status': 'Pending For Barcode Generation',
      'description': '123123',
      'name': null,
      'start_date': null,
      'end_date': null,
      'web_sale_start_date': null,
      'show_code': null,
      'web_sale_end_date': null,
      'venue_code': null,
      'created_at': '2024-02-01T15:20:21.000Z',
      'updated_at': '2024-02-01T15:20:21.000Z'
    },
    {
      'id': 52,
      'performance_code': 'qweqwe',
      'title': 'qweqw',
      'status': 'Pending For Barcode Generation',
      'description': 'qweqwe',
      'name': null,
      'start_date': null,
      'end_date': null,
      'web_sale_start_date': null,
      'show_code': null,
      'web_sale_end_date': null,
      'venue_code': null,
      'created_at': '2024-02-01T15:23:27.000Z',
      'updated_at': '2024-02-01T15:23:27.000Z'
    },
    {
      'id': 53,
      'performance_code': 'asdfasd',
      'title': 'asdfas',
      'status': 'Pending For Barcode Generation',
      'description': 'asdf',
      'name': null,
      'start_date': null,
      'end_date': null,
      'web_sale_start_date': null,
      'show_code': null,
      'web_sale_end_date': null,
      'venue_code': null,
      'created_at': '2024-02-01T15:26:30.000Z',
      'updated_at': '2024-02-01T15:26:30.000Z'
    },
    {
      'id': 54,
      'performance_code': 'asdsad',
      'title': 'asdas',
      'status': 'Pending For Barcode Generation',
      'description': 'asdasd',
      'name': null,
      'start_date': null,
      'end_date': null,
      'web_sale_start_date': null,
      'show_code': null,
      'web_sale_end_date': null,
      'venue_code': null,
      'created_at': '2024-02-01T15:33:53.000Z',
      'updated_at': '2024-02-01T15:33:53.000Z'
    },
    {
      'id': 55,
      'performance_code': 'asdasd123',
      'title': 'asdas',
      'status': 'Pending For Barcode Generation',
      'description': 'asdasd',
      'name': null,
      'start_date': null,
      'end_date': null,
      'web_sale_start_date': null,
      'show_code': null,
      'web_sale_end_date': null,
      'venue_code': null,
      'created_at': '2024-02-01T15:46:05.000Z',
      'updated_at': '2024-02-01T15:46:05.000Z'
    },
    {
      'id': 56,
      'performance_code': 'asdqweasdzxc',
      'title': 'asdad',
      'status': 'Pending For Barcode Generation',
      'description': 'asdasd',
      'name': null,
      'start_date': null,
      'end_date': null,
      'web_sale_start_date': null,
      'show_code': null,
      'web_sale_end_date': null,
      'venue_code': null,
      'created_at': '2024-02-01T16:40:06.000Z',
      'updated_at': '2024-02-01T16:40:06.000Z'
    },
    {
      'id': 57,
      'performance_code': 'asdfasdfasdf',
      'title': 'asdfasdf',
      'status': 'Pending For Barcode Generation',
      'description': 'asdfasdf',
      'name': null,
      'start_date': null,
      'end_date': null,
      'web_sale_start_date': null,
      'show_code': null,
      'web_sale_end_date': null,
      'venue_code': null,
      'created_at': '2024-02-01T18:17:42.000Z',
      'updated_at': '2024-02-01T18:17:42.000Z'
    },
    {
      'id': 58,
      'performance_code': 'asdf',
      'title': 'asdf',
      'status': 'Pending For Barcode Generation',
      'description': 'asdf',
      'name': null,
      'start_date': null,
      'end_date': null,
      'web_sale_start_date': null,
      'show_code': null,
      'web_sale_end_date': null,
      'venue_code': null,
      'created_at': '2024-02-05T11:26:50.000Z',
      'updated_at': '2024-02-05T11:26:50.000Z'
    },
    {
      'id': 59,
      'performance_code': 'asdasdasd123123',
      'title': 'asdasd1231231',
      'status': 'Pending For Barcode Generation',
      'description': 'asdasd',
      'name': null,
      'start_date': null,
      'end_date': null,
      'web_sale_start_date': null,
      'show_code': null,
      'web_sale_end_date': null,
      'venue_code': null,
      'created_at': '2024-02-05T11:37:56.000Z',
      'updated_at': '2024-02-05T11:37:56.000Z'
    }
  ],
  'message': 'sucessful',
  'status_code': 200
};
const PieCharts = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const label = [...new Set(data.data.map(s => s.status))];

    label.forEach((l, k)=> {
      setChartData(prev => [...prev, {
        id: k, value: data.data.filter(str => str.status === l).length, label: l
      }]);
    });

    return () => {
      setChartData([]);
    };
  }, []);

  return <>
    { chartData &&
        <PieChart
          id="charts"
          title="Investigating Chart Titles with Wrapping for Excessive Length"
          titleStyle={{ textOverflow: 'Wrap' }}
          series={[
            {
              arcLabel: (item) => `${item.value}`,
              data: chartData,
              highlightScope: {
                faded: 'global', highlighted: 'item'
              },
              faded: {
                innerRadius: 30, additionalRadius: -30, color: 'gray'
              }
            }
          ]}
          sx={{
            display: 'grid',
            width: 300,
            justifyContent: 'flex-start',
            alignItems: 'flex-start'
          }}
          width={700}
          height={200}
        />
    }
  </>;
};

export default memo(PieCharts);
