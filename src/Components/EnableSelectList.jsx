import { useEffect, useRef, useState } from 'react';
import '../Style/EnableSelectList.css';
import { theme } from 'antd';
const { useToken } = theme;

/**
 * 可选择List
 * @param {} props
 * @returns
 */
const EnableSelectList = (props) => {
    const { token } = useToken();

    const [dataList, setDataList] = useState(props.dataSource);

    const inputRef = useRef();
    const listRef = useRef();

    let curSelectedIndex = 0;

    useEffect(() => {
        setDataList(props.dataSource);

        //默认清空上次的选中项目
        curSelectedIndex = 0;
        markItem(listRef.current.querySelectorAll('li'));

        const input = inputRef.current;

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
                markItem(listRef.current.querySelectorAll('li'));
                break;
            case 'ArrowDown':
                curSelectedIndex++;
                curSelectedIndex = Math.min(dataList.length - 1, curSelectedIndex);
                markItem(listRef.current.querySelectorAll('li'));
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
            <ul id="enable-select-list" ref={listRef}>
                {dataList.map((item, index) => (
                    <li
                        style={{
                            backgroundColor: token.colorBgContainer,
                            padding: token.padding,
                            color: token.colorText,
                        }}
                        className={index === 0 ? 'selected' : ''}
                        key={index}
                        onClick={() => {
                            curSelectedIndex = index;
                            markItem(listRef.current.querySelectorAll('li'));
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
