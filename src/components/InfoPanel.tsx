import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

type TProps = {
  dataPlot: {
    idle: number
    loaded: number
    unloaded: number
    offline: number
    averages: {
      idle: string
      loaded: string
      unloaded: string
      offline: string
    }
    timeLength: {
      fromts: number
      tots: number
    }
  }
}

export default function InfoPanel(dataPlot: TProps) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fromts = new Date(dataPlot.dataPlot.timeLength.fromts).toLocaleString()
  const tots = new Date(dataPlot.dataPlot.timeLength.tots).toLocaleString()

  const title = 'Status information - Pump'

  return (
    <div className='m-2'>
      <Button variant="warning" onClick={handleShow}>
        {title}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Interval:</p>
          <span>
            <strong>From:</strong> {fromts}
          </span>
          <span>
            <strong>To:</strong> {tots}
          </span>
          <hr />
          <p>Parameters:</p>
          <ul>
            <li>
              <strong>Idle:</strong> n {'<'} 20%
            </li>
            <li>
              <strong>Loaded:</strong> 20% {'<='} n {'<='} 100%
            </li>
            <li>
              <strong>Unloaded:</strong> n ≈ 0.1A
            </li>
            <li>
              <strong>Offline:</strong> n = 0 (no current)
            </li>
          </ul>
          <p>NOL (interval): 16.22%</p>
          <table className='InfoTable'>
            <thead>
              <tr>
                <th>Status</th>
                <th>Idle</th>
                <th>Loaded</th>
                <th>Unloaded</th>
                <th>Offline</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Times</td>
                <td>{dataPlot.dataPlot.idle}</td>
                <td>{dataPlot.dataPlot.loaded}</td>
                <td>{dataPlot.dataPlot.unloaded}</td>
                <td>{dataPlot.dataPlot.offline}</td>
              </tr>
              <tr>
                <td>Average</td>
                <td>{dataPlot.dataPlot.averages.idle}</td>
                <td>{dataPlot.dataPlot.averages.loaded}</td>
                <td>{dataPlot.dataPlot.averages.unloaded}</td>
                <td>{dataPlot.dataPlot.averages.offline}</td>
              </tr>
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
