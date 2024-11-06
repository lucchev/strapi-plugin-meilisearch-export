import {
  Box,
  Button,
  Flex,
  Grid,
  Main,
  Modal,
  SingleSelect,
  SingleSelectOption,
  Typography,
} from '@strapi/design-system'
import { useFetchClient } from '@strapi/strapi/admin'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { pluginId } from '../pluginId'
import { isCollectionLocalized } from '../utils/fetchCollectionLocalization'
import { getTrad } from '../utils/getTrad'

type Index = {
  indexName: string
  collection: string
}

type InternationalizedIndexName = Index & {
  internationalizedIndexName: string
}

type ModalContent = {
  title: string
  message: string
  confirmText: string
  actionConfirmed: string
}

const HomePage = () => {
  const { formatMessage } = useIntl()
  const [indexes, setIndexes] = useState<Index[]>([])
  const [indexesWithLocales, setIndexesWithLocales] = useState<InternationalizedIndexName[]>([])
  const [locales, setLocales] = useState([])
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null)
  const [modalAction, setModalAction] = useState<() => void>(() => () => {})
  const [modalContent, setModalContent] = useState<ModalContent | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isActionConfirmed, setIsActionConfirmed] = useState(false)

  const { get, del, put, post } = useFetchClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [localesResponse, settingsResponse] = await Promise.all([
          get('/i18n/locales'),
          get(`/${pluginId}/settings`),
        ])

        const locales = localesResponse.data.map((locale: any) => locale.code)
        setLocales(locales)

        setIndexes(settingsResponse.data.index)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const updateLocalizedIndexes = async () => {
      // For each index, check if the collection is localized
      const localizedIndexes: InternationalizedIndexName[] = []
      for (const index of indexes) {
        const collection = index.collection
        const isLocalized = await isCollectionLocalized(get, collection)

        if (isLocalized) {
          for (const locale of locales) {
            localizedIndexes.push({
              indexName: index.indexName,
              collection: index.collection,
              internationalizedIndexName: index.indexName + '_' + locale,
            })
          }
        } else {
          localizedIndexes.push({
            indexName: index.indexName,
            collection: index.collection,
            internationalizedIndexName: index.indexName,
          })
        }
      }
      setIndexesWithLocales(localizedIndexes)
    }
    updateLocalizedIndexes()
  }, [indexes])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalVisible) {
        handleCloseModal()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModalVisible])

  const showModal = (action: () => void, content: ModalContent) => {
    setModalAction(() => action)
    setModalContent(content)
    setIsModalVisible(true)
  }

  const handleIndexChange = (value: string) => {
    setSelectedIndex(value)
  }

  const handleConfirm = async () => {
    await modalAction()
    setIsActionConfirmed(true)
  }

  const handleCloseModal = () => {
    setModalContent(null)
    setModalAction(() => () => {})
    setIsModalVisible(false)
    setIsActionConfirmed(false)
  }

  const handleUpdateSettings = () => {
    if (!selectedIndex) {
      return false
    }
    showModal(() => put(`/${pluginId}/indexes/${selectedIndex}/settings`), {
      title: formatMessage({ id: getTrad('updateSettingsTitle') }),
      message: formatMessage({ id: getTrad('confirmUpdateSettings') }),
      confirmText: formatMessage({ id: getTrad('confirmUpdateSettingsBtn') }),
      actionConfirmed: formatMessage({ id: getTrad('actionUpdateSettings') }),
    })
  }

  const handleRebuildIndex = () => {
    if (!selectedIndex) {
      return false
    }
    showModal(() => put(`/${pluginId}/indexes/${selectedIndex}`), {
      title: formatMessage({ id: getTrad('rebuildIndexTitle') }),
      message: formatMessage({ id: getTrad('confirmUpdateIndex') }),
      confirmText: formatMessage({ id: getTrad('confirmUpdateBtn') }),
      actionConfirmed: formatMessage({ id: getTrad('actionUpdateIndex') }),
    })
  }

  const handleDeleteIndex = async () => {
    if (!selectedIndex) {
      return false
    }
    showModal(
      async () => {
        try {
          await del(`/${pluginId}/indexes/${selectedIndex}`)
        } catch (error) {
          console.error('Failed to delete index:', error)
        }
      },
      {
        title: formatMessage({ id: getTrad('deleteIndexTitle') }),
        message: formatMessage({ id: getTrad('confirmDeleteIndex') }),
        confirmText: formatMessage({ id: getTrad('confirmDeleteBtn') }),
        actionConfirmed: formatMessage({ id: getTrad('actionDeleteIndex') }),
      }
    )
  }

  return (
    <Main>
      <Modal.Root open={isModalVisible}>
        <Box padding={8} background='neutral100'>
          <Typography as='h1' variant='alpha' textColor='neutral800'>
            {formatMessage({ id: getTrad('intro') })
              .split('. ')
              .map((sentence, index) => (
                <span key={index}>
                  {sentence}.
                  <br />
                </span>
              ))}
          </Typography>

          <Typography as='p' variant='epsilon' textColor='neutral800'>
            {formatMessage({ id: getTrad('description') })
              .split('. ')
              .map((sentence, index) => (
                <span key={index}>
                  {sentence}.
                  <br />
                </span>
              ))}
          </Typography>

          <Grid.Root gap={6}>
            <Grid.Item col={12}>
              <Box
                padding={6}
                shadow='tableShadow'
                background='neutral0'
                marginBottom={4}
                marginTop={4}
                minWidth='33vw'
              >
                <Box marginBottom={4}>
                  <Typography variant='delta' as='h2'>
                    {formatMessage({ id: getTrad('indexSelection') })}
                  </Typography>
                </Box>
                {indexesWithLocales.length > 0 && (
                  <SingleSelect
                    label={formatMessage({ id: getTrad('selectIndex') })}
                    placeholder={formatMessage({ id: getTrad('chooseIndex') })}
                    value={selectedIndex}
                    onChange={handleIndexChange}
                  >
                    {indexesWithLocales.map(index => (
                      <SingleSelectOption
                        key={index.internationalizedIndexName}
                        value={index.internationalizedIndexName}
                      >
                        {index.internationalizedIndexName}
                      </SingleSelectOption>
                    ))}
                  </SingleSelect>
                )}
              </Box>
            </Grid.Item>

            <Grid.Item col={12}>
              <Box
                padding={6}
                shadow='tableShadow'
                background='neutral0'
                marginBottom={4}
                minWidth='33vw'
              >
                <Box marginBottom={4}>
                  <Typography variant='delta' as='h2'>
                    {formatMessage({ id: getTrad('contentManagement') })}
                  </Typography>
                </Box>
                <Flex gap={2}>
                  <Modal.Trigger>
                    <Button
                      onClick={handleRebuildIndex}
                      variant='secondary'
                      disabled={!selectedIndex}
                    >
                      {formatMessage({ id: getTrad('rebuildIndex') })}
                    </Button>
                  </Modal.Trigger>
                  <Modal.Trigger>
                    <Button onClick={handleDeleteIndex} variant='danger' disabled={!selectedIndex}>
                      {formatMessage({ id: getTrad('deleteIndex') })}
                    </Button>
                  </Modal.Trigger>
                </Flex>
              </Box>
            </Grid.Item>

            <Grid.Item col={12}>
              <Box
                padding={6}
                shadow='tableShadow'
                background='neutral0'
                marginBottom={4}
                minWidth='33vw'
              >
                <Box marginBottom={4}>
                  <Typography variant='delta' as='h2'>
                    {formatMessage({ id: getTrad('configManagement') })}
                  </Typography>
                </Box>
                <Modal.Trigger>
                  <Button onClick={handleUpdateSettings} disabled={!selectedIndex}>
                    {formatMessage({ id: getTrad('updateSettings') })}
                  </Button>
                </Modal.Trigger>
              </Box>
            </Grid.Item>
          </Grid.Root>
        </Box>

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
              <Button onClick={handleCloseModal} variant='success'>
                {formatMessage({ id: getTrad('close') })}
              </Button>
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
      </Modal.Root>
    </Main>
  )
}

export { HomePage }
