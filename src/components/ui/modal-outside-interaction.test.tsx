import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from './alert-dialog'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './dialog'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from './sheet'

async function clickOverlay(slot: string) {
  const overlay = document.querySelector(`[data-slot='${slot}']`)
  if (!overlay) throw new Error(`Missing overlay: ${slot}`)

  // Wait for Radix to register its outside-pointer listener.
  await new Promise((resolve) => setTimeout(resolve, 0))
  overlay.dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      button: 0,
      pointerType: 'mouse',
    })
  )
}

describe('modal outside interaction', () => {
  it('does not close a dialog when the overlay is clicked', async () => {
    const onOpenChange = vi.fn()
    const { getByRole } = await render(
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle>Dialog title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
        </DialogContent>
      </Dialog>
    )

    await clickOverlay('dialog-overlay')

    expect(onOpenChange).not.toHaveBeenCalled()
    await expect.element(getByRole('dialog')).toBeInTheDocument()
  })

  it('does not close an alert dialog when the overlay is clicked', async () => {
    const onOpenChange = vi.fn()
    const { getByRole } = await render(
      <AlertDialog open onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogTitle>Alert dialog title</AlertDialogTitle>
          <AlertDialogDescription>
            Alert dialog description
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    )

    await clickOverlay('alert-dialog-overlay')

    expect(onOpenChange).not.toHaveBeenCalled()
    await expect.element(getByRole('alertdialog')).toBeInTheDocument()
  })

  it('does not close a sheet when the overlay is clicked', async () => {
    const onOpenChange = vi.fn()
    const { getByRole } = await render(
      <Sheet open onOpenChange={onOpenChange}>
        <SheetContent>
          <SheetTitle>Sheet title</SheetTitle>
          <SheetDescription>Sheet description</SheetDescription>
        </SheetContent>
      </Sheet>
    )

    await clickOverlay('sheet-overlay')

    expect(onOpenChange).not.toHaveBeenCalled()
    await expect.element(getByRole('dialog')).toBeInTheDocument()
  })
})
