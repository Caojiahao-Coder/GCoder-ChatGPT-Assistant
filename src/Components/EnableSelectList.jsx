import { useEffect, useRef, useState } from 'react';
import { useStateCallback } from '../Hooks/useStateCallback';
import '../Style/EnableSelectList.css';

/**
 * 可选择List
 * @param {} props
 * @returns
 */
const EnableSelectList = (props) => {
    const [dataList, setDataList] = useState(props.dataSource);
    const [isShow, setIsShow] = useStateCallback(false);

    const inputRef = useRef();

    let curSelectedIndex = 0;

    useEffect(() => {
        setDataList(props.dataSource);
        setIsShow(props.isShow);

        const input = document.getElementById('enable-select-input');

        if (props.isShow && inputRef.current)
            setTimeout(() => {
                if (inputRef.current) inputRef.current.focus();
            }, 100);

        input.removeEventListener('keydown', onInputKeyDown);
        input.addEventListener('keydown', onInputKeyDown);

        return () => {
            input.removeEventListener('keydown', onInputKeyDown);
        };
    }, [props.dataSource, props.isShow]);

    /**
     * 建立Input事件监听器
     * @param {*} e
     */
    const onInputKeyDown = (e) => {
        e.preventDefault();
        switch (e.key) {
            case 'Enter':
                onClickItem(dataList[curSelectedIndex].value);
                break;
            case 'ArrowUp':
                curSelectedIndex--;
                curSelectedIndex = Math.max(0, curSelectedIndex);
                markItem(document.getElementById('enable-select-list').querySelectorAll('li'));
                break;
            case 'ArrowDown':
                curSelectedIndex++;
                curSelectedIndex = Math.min(dataList.length - 1, curSelectedIndex);
                markItem(document.getElementById('enable-select-list').querySelectorAll('li'));
                break;
            case 'Escape':
                props.onCancel();
                break;
        }
    };

    /**
     * 标记当前选中的Item
     * @param {*} list
     */
    function markItem(list) {
        list.forEach((element, index) => {
            if (index === curSelectedIndex) {
                element.classList.add('selected');
            } else {
                element.classList.remove('selected');
            }
        });
    }

    /**
     * 当选中了Item
     * @param {} value
     */
    function onClickItem(value) {
        if (props.submitCallback) props.submitCallback(value);
    }

    return (
        <div id="enable-select-list-root">
            <input id="enable-select-input" ref={inputRef} autoFocus={true} autoComplete="off" />
            <ul id="enable-select-list">
                {dataList.map((item, index) => (
                    <li
                        className={index === 0 ? 'selected' : ''}
                        key={index}
                        onClick={() => {
                            curSelectedIndex = index;
                            markItem(
                                document.getElementById('enable-select-list').querySelectorAll('li')
                            );
                            setTimeout(() => onClickItem(item.value), 50);
                        }}
                    >
                        {item.item}
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default EnableSelectList;
