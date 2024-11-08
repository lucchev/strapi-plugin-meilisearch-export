import { Box, Button, Modal, Typography } from '@strapi/design-system'
import { useIntl } from 'react-intl'
import { getTrad } from '../utils/getTrad'

export type ModalContent = {
  title: string
  message: string
  confirmText: string
  actionConfirmed: string
}

type Props = {
  modalContent: ModalContent | null
  handleCloseModal: () => void
  handleConfirm: () => void
  isActionConfirmed: boolean
}

const ModalWrapper = ({
  modalContent,
  handleCloseModal,
  handleConfirm,
  isActionConfirmed,
}: Props) => {
  const { formatMessage } = useIntl()
  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.Title>{modalContent?.title}</Modal.Title>
        <Button
          onClick={handleCloseModal}
          variant='tertiary'
          style={{ position: 'absolute', right: '1.6rem', top: '1.6rem' }}
        >
          X
        </Button>
      </Modal.Header>
      <Modal.Body>
        {isActionConfirmed ? (
          <Typography>{modalContent?.actionConfirmed}</Typography>
        ) : (
          modalContent?.message.split('\n').map((line, index) => (
            <Box marginBottom={0} key={index}>
              <Typography>{line}</Typography>
            </Box>
          ))
        )}
      </Modal.Body>
      <Modal.Footer>
        {isActionConfirmed ? (
          <Modal.Close style={{ marginLeft: 'auto' }}>
            <Button onClick={handleCloseModal} variant='success'>
              {formatMessage({ id: getTrad('close') })}
            </Button>
          </Modal.Close>
        ) : (
          <>
            <Modal.Close>
              <Button onClick={handleCloseModal} variant='tertiary'>
                {formatMessage({ id: getTrad('cancel') })}
              </Button>
            </Modal.Close>
            <Button onClick={handleConfirm} variant='success'>
              {modalContent?.confirmText}
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal.Content>
  )
}

export default ModalWrapper
