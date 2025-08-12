'use client';
import { useUpdateMe } from '@/app/http/queries/useMe';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PenIcon from '@/libs/shared/icons/Pen';
import { Loader2, User2Icon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Props = {
  name: string | undefined;
};
const InputName = ({ name }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { mutate, isPending, isSuccess } = useUpdateMe();
  const userNameRef = useRef<HTMLInputElement>(null);
  const handleConfirm = () => {
    if (!userNameRef.current) {
      return;
    }
    mutate(userNameRef.current.value);
  };
  useEffect(() => {
    if (isSuccess) {
      setIsOpen(false);
      userNameRef.current!.value = '';
    }
  }, [isSuccess]);
  return (
    <div className="flex items-center">

      <h2
        className="text-shadow-custom my-4 border-0"
      >
        {/* {formatAddress(address || '', 5)} */}
        {name}
      </h2>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="translate-y-1">
          <PenIcon />
        </DialogTrigger>
        <DialogContent className="confirm-dialog gap-3">
          <DialogHeader>
            <DialogTitle className="text-shadow-custom text-center flex items-center text-xl">
              <User2Icon className="mr-2" />
              {' '}
              Thay đổi tên người dùng
            </DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="current-username" className="text-shadow-custom text-left">Tên người dùng hiện tại</Label>
            <Input
              value={name || ''}
              disabled
              id="current-username"
              className="text-white w-60"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-username" className="text-shadow-custom text-left">
              Tên người dùng mới
            </Label>
            <Input
              id="new-username"
              placeholder="Nhập tên người dùng mới"
              className="text-white w-60"
              ref={userNameRef}
            />
          </div>

          <div className="space-x-3 px-3 flex w-full mt-3">

            <Button
              variant="outline"
              className="bg-transparent text-white w-1/2"
              onClick={() => setIsOpen(false)}
            >
              Hủy bỏ
            </Button>
            <Button
              className="w-1/2 button-custom"
              disabled={isPending}
              onClick={handleConfirm}
            >
              {isPending ? <Loader2 className="animate-spin" /> : 'Xác nhận'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InputName;
